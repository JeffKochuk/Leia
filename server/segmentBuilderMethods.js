/**
 * Created by jkochuk on 10/3/16.
 */

import { Meteor } from 'meteor/meteor';
import { getConnection, getQueryPromise } from '../imports/helpers/mysql.js';
import promisify  from 'es6-promisify';
import { accumulateStats, mysqlMap } from '../imports/helpers/stats.js';
import fetch from 'node-fetch';
import sqlstring from 'sqlstring';

// Data should look like this
// {
//      email: "jkochuk@redhat.com",
//      areasOfInterest: Array[2],
//      interestSource: Array[1],
//      activeUsers: false,
//      personas: Array[2],
//      completeness: true,
//      geography: "",
//      geographyRadius: "",
//      industry: Array[1]
// }
const statsFields = ['Language', 'Size', 'Industry', 'SuperRegion', 'Persona'];
const sparseStatsFields = ['Company', 'Country', 'MetroArea'];
const fullStatsFields = ['Persona', 'Language', 'Size', 'Industry', 'Company', 'Country', 'MLSMScore', 'MLSMRank'];

Meteor.methods({
    getQuickStats(filters) {
        if (!(filters.Themes && filters.Themes.length)) {
            console.log('No Themes')
            console.log(filters);
            return { loading: false };
        }
        const query = getQueryPromise();
        // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
        // const startTime = Date.now(); // @todo remove
        const { Themes, ...rest } = filters;
        const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);
        let qs = `SELECT ${statsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY Language, Size, Industry, SuperRegion, Persona;`;
        console.log(qs);
        const res = query(qs).await();
        // const midTime = Date.now();// @todo remove
        let count = 0;
        const stats = { count: 0 };
        for (let n of statsFields) {
            stats[n]={};
        }
        for (let row of res) {
            const { count } = row;
            stats.count += count;
            for (let stat of statsFields) {
                stats[stat][row[stat]] = (stats[stat][row[stat]] || 0) + count;
            }
        }
        // console.log('Count', stats.count); //@todo
        // console.log('Half Way', midTime - startTime);//@todo
        // console.log('Full time', Date.now() - startTime);//@todo
        return { stats }
    },

    // @todo you can just put this as another instance of getStats
    getSparseStats(filters) {
        if (!(filters.Themes && filters.Themes.length)) {
            console.log('No Themes')
            console.log(filters);
            return { loading: false };
        }
        const query = getQueryPromise();
        // const qs = `SELECT COUNT(*) as count FROM (${themes.map(e => `SELECT emailAddress FROM ${e}`).join(' UNION DISTINCT ')}) a`;
        // const startTime = Date.now(); // @todo remove
        const { Themes, ...rest } = filters;
        const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length);
        let qs = `SELECT ${sparseStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${sparseStatsFields};`;
        console.log(qs);
        const res = query(qs).await();
        const sparseStats = {};
        for (let n of sparseStatsFields) {
            sparseStats[n]={};
        }
        for (let row of res) {
            const { count } = row;
            sparseStats.count += count;
            for (let stat of sparseStatsFields) {
                sparseStats[stat][row[stat]] = (sparseStats[stat][row[stat]] || 0) + count;
            }
        }
        return { sparseStats }
    },

    getFullStats(filters) {
        // const startTime = Date.now(); // @todo remove
        if (!(filters.Themes && filters.Themes.length)) {
            console.log('No Themes');
            console.log(filters);
            return { loading: false };
        }
        const { Themes, ...rest } = filters;
        const filtersWithCriteria = Object.keys(rest).filter(k=>rest[k].length); // Get keys of rest with values of non-empty arrays
        let qs = `SELECT ${fullStatsFields}, COUNT(*) AS count FROM ${Themes[0]} a LEFT JOIN contacts b ON a.emailAddress = b.emailAddress WHERE ${filtersWithCriteria.length ? filtersWithCriteria.map(k=>`${k} IN (${rest[k].map(sqlstring.escape)})`).join(' AND ') : '1=1'} GROUP BY ${fullStatsFields};`;
        const query = getQueryPromise();
        console.log(qs);
        const queryReturn = query(qs)
            .then((rows) => {
                console.log(rows.length);
                return rows;
            })
            .await();
        const fullStats = accumulateStats(queryReturn, 'mysql', null);
        console.log(fullStats.total);
        return {
            fullStats
        };
    },
    
    
    segmentBuilderBuildOriginalStats(formData) {
        let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
        let whereClauses = [];
        let isThereEnoughData = false;
        if (formData.engagement && formData.engagement.length) {
            whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.personas.length) {
            whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.completeness && formData.completeness.length) {
            whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.industry.length) {
            whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.metro.length) {
            whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.theme.length) {
            query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
            isThereEnoughData = true;
        }

        if (isThereEnoughData) {
            if (whereClauses.length) {
                query = query + ' where ' + whereClauses.join(' AND ');
            }
            console.log(query);
            //@todo remove this LIMIT once you have indices in place
            query = query + ' LIMIT 10000';
            const connection = getConnection();
            const queryDB = promisify(connection.query, connection);
            const queryReturn = queryDB(query)
                .then((rows) => {
                    console.log(rows.length);
                    return rows;
                })
                .await();

            const stats = accumulateStats(queryReturn, 'mysql', null);
            // console.log(stats);
            const segment = {
                stats,
                total: queryReturn.length
            };
            // console.log(segment);
            return segment;

        } else {
            throw new Meteor.Error('Need more details');
        }
    },
    testStatsMethod(formData) {
        const startTimeMethod1 = Date.now();
        let query = 'select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from contacts';
        let whereClauses = [];
        let isThereEnoughData = false;
        if (formData.engagement && formData.engagement.length) {
            whereClauses.push(`EngagementStatus IN ('${formData.engagement.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.personas.length) {
            whereClauses.push(`Persona IN ('${formData.personas.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.completeness && formData.completeness.length) {
            whereClauses.push(`CompletenessLevel IN ('${formData.completeness.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.industry.length) {
            whereClauses.push(`Industry IN ('${formData.industry.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.metro.length) {
            whereClauses.push(`MetroArea IN ('${formData.metro.join("','")}')`);
            isThereEnoughData = true;
        }
        if (formData.theme.length) {
            query = "select contacts.Persona as Persona, contacts.Language as Language, contacts.Size as Size, contacts.Industry as Industry, contacts.Company as Company, contacts.Country as Country, contacts.MLSMScore as MLSMScore, contacts.MLSMRank as MLSMRank, contacts.MetroArea as MetroArea, contacts.EngagementStatus as EngagementStatus from (SELECT distinct emailAddress from THEME_LINK where theme in ('" + formData.theme.join('\',\'') + "')) theme inner join contacts on theme.emailAddress = contacts.emailAddress ";
            isThereEnoughData = true;
        }

        if (isThereEnoughData) {
            if (whereClauses.length) {
                query = query + ' where ' + whereClauses.join(' AND ');
            }
            console.log(query);
            //@todo remove this LIMIT once you have indices in place
            // query = query + ' LIMIT 10000';
            const connection = getConnection();
            const queryDB = promisify(connection.query, connection);
            const queryReturn = queryDB(query)
                .then((rows) => {
                    console.log(rows.length);
                    return rows;
                })
                .await();

            const stats = accumulateStats(queryReturn, 'mysql', null);
            // console.log(stats);
            const segment = {
                stats,
                total: queryReturn.length
            };
            // console.log(segment);
            const endTimeMethod1 = Date.now();
            console.log('Time for stats method 1', endTimeMethod1 - startTimeMethod1, '::::', Math.ceil((endTimeMethod1 - startTimeMethod1) / 1000), 'sec')
            return segment;
            
            // const startTimeMethod2 = Date.now();
            // const fromQuery = query.slice(query.indexOf('from'));
            // const countQueries = [];
            // mysqlMap.forEach((key, name) => countQueries.push(`SELECT ${name}, COUNT(*) as 'count' ${fromQuery} GROUP BY ${name}`));
            // console.log(countQueries);
            // const joinedQuery = countQueries.join('; ');
            // const stats2 = {};
            // queryDB(joinedQuery)
            //     .then((results) => {
            //         // console.log(stats);
            //         // console.log(results);
            //         //results is an array of [{word, count(*)},{}],[]
            //         results.forEach((entries) => {
            //             let thisSetOfStats = '';
            //             let thisDbName = '';
            //             entries.forEach((entry) => {
            //                 if (!thisSetOfStats) {
            //                     const thisEntryHolder = Object.keys(entry).filter((x) => x !== 'count');
            //                     if (thisEntryHolder.length) {
            //                         thisDbName = thisEntryHolder[0];
            //                         thisSetOfStats = mysqlMap.get(thisDbName);
            //                         stats2[thisSetOfStats] = {}
            //                     }
            //                 }
            //                 // Yeah this will be annoying to figure out so here's how it goes:
            //                 //
            //                 // Entries looks like this:
            //                 // [ { MLSMScore: 'B1', 'count': 70 },
            //                 // { MLSMScore: 'B2', 'count': 94 }, ... ]
            //                 //
            //                 // We want it to look like this:
            //                 // { MLSMScore: {
            //                 //      B1: 70,
            //                 //      B2: 94, ...
            //                 //    }
            //                 // }
            //                 stats2[thisSetOfStats][entry[thisDbName]] = entry.count;
            //             });
            //         });
            //     })
            //     .catch(console.log)
            //     .await();
            // //rankData, companies, map, etc...
            //
            //
            //
            // const endTimeMethod2 = Date.now();
            // console.log('Time for stats method 1', endTimeMethod2 - startTimeMethod2, '::::', Math.ceil((endTimeMethod2 - startTimeMethod2) / 1000), 'sec');
            //
            // // console.log(stats2);
            //
            //
            //
            //
            //
            // segment.stats = stats2;
            // return segment;

        } else {
            throw new Meteor.Error('Need more details');
        }
    },

    //@TODO IMPLEMENT EVENTUALLY
    segmentBuilderSaveToEloqua(formData){
        const placeToPostTo = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment';
        const thenQueue = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment/queue';

        const criteria = [];
        if (formData.engagement && formData.engagement.length) {
            const criterion = {
                "type": "ContactFieldCriterion",
                "id": "-1",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-1",
                    "quickListString": formData.engagement.join(',')
                },
                "fieldId": "100837"
            };
            criteria.push(criterion)
        }

        if (formData.personas && formData.personas.length) {
            const criterion = {
                "type": "ContactFieldCriterion",
                "id": "-2",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-2",
                    "quickListString": formData.personas.join(',')
                },
                "fieldId": "100837"
            };
            criteria.push(criterion)
        }

        if (formData.completeness && formData.completeness.length) {
            const criterion = {
                "type": "ContactFieldCriterion",
                "id": "-3",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-3",
                    "quickListString": formData.completeness.join(',')
                },
                "fieldId": "100811"
            };
            criteria.push(criterion)
        }

        if (formData.industry && formData.industry.length) {
            const criterion = {
                "type": "ContactFieldCriterion",
                "id": "-4",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-4",
                    "quickListString": formData.industry.join(',')
                },
                "fieldId": "100046"
            };
            criteria.push(criterion)
        }

        if (formData.metro && formData.metro.length) {
            const criterion = {
                "type": "ContactFieldCriterion",
                "id": "-5",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-5",
                    "quickListString": formData.metro.join(',')
                },
                "fieldId": "100818"
            };
            criteria.push(criterion)
        }

        if (formData.theme && formData.theme.length) {
            //@todo do theme here
            console.log("We don't *DO* theme here...");
        }

        const filter = {
            "isIncluded": "true",
            "filter": {
                "name": "Filter Criterion 1",
                "scope": "local",
                "id": "-111",
                "createdBy": "2084",
                "createdAt": "" + new Date().valueOf() / 1000,
                "type": "ContactFilter",
                "criteria": criteria,
                "statement": criteria.map((c) => c.id).join(' AND '),
                "x_e10_isTemplate": "false",
                "permissions": [
                    "Retrieve",
                    "Update",
                    "Delete",
                    "SetSecurity"
                ]
            },
            "id": "-112",
            "type": "ContactFilterSegmentElement"
        };

        const template = {
            "createdBy": "2084",
            "createdAt": "1476197319",
            // "updatedBy": "2084",
            // "updatedAt": "1476197319",
            "currentStatus": "Draft",
            "type": "ContactSegment",
            "elements": [
                filter
            ],
            "isBlankTemplate": true,
            "id": "-211",
            "name": `TESTTEST: ${formData.name}`,
            "permissions": [
                "Retrieve",
                "Update",
                "Delete",
                "SetSecurity"
            ],
            "folderId": "180344",
            "x_e10_isTemplate": "false",
            "depth": "complete"
        };
        console.log(JSON.stringify(template));

        fetch(placeToPostTo, { method: 'POST', body: JSON.stringify(template), headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } })
            .then((res) => res.json())
            .then((json) => {
                console.log('***** First Half *****');
                console.log(json);
                return fetch(`${thenQueue}/${json.id}`, { method: 'POST', headers: { authorization: process.env.AUTHORIZATION, "Content-Type": "application/json" } })
            })
            .then((res) => res.json())
            .then((json) => {
                console.log('***** QUEUE RES *****');
                console.log(json);
            })
            .await();
        console.log('DONE!');


    }
});


// const thisOneWorked = {
//     "createdBy": "2084",
//     "createdAt": "1476197319",
//     "currentStatus": "Draft",
//     "type": "ContactSegment",
//     "elements": [
//         {
//             "isIncluded": "true",
//             "filter": {
//                 "name": "Filter Criteria 1",
//                 "scope": "local",
//                 "id": "-111",
//                 "createdBy": "2084",
//                 "createdAt": "1476197359",
//                 "type": "ContactFilter",
//                 "criteria": [{
//                     "type": "ContactFieldCriterion",
//                     "id": "-5",
//                     "condition": {
//                         "type": "TextSetCondition",
//                         "operator": "in",
//                         "optionListId": "-5",
//                         "quickListString": "High,Medium"
//                     },
//                     "fieldId": "100811"
//                 }],
//                 "statement": "-5",
//                 "x_e10_isTemplate": "false",
//                 "permissions": [
//                     "Retrieve",
//                     "Update",
//                     "Delete",
//                     "SetSecurity"
//                 ]
//             },
//             "id": "-112",
//             "type": "ContactFilterSegmentElement"
//         }
//     ],
//     "isBlankTemplate": true,
//     "id": "-211",
//     "name": "TEST REST 123123",
//     "permissions": [
//         "Retrieve",
//         "Update",
//         "Delete",
//         "SetSecurity"
//     ],
//     "folderId": "180344",
//     "x_e10_isTemplate": "false",
//     "depth": "complete"
// };


var x = {
    "createdBy": "2084",
    "createdAt": "1476197319",
    "currentStatus": "Draft",
    "type": "ContactSegment",
    "elements": [{
        "isIncluded": "true",
        "filter": {
            "name": "Filter Criterion 1",
            "scope": "local",
            "id": "-111",
            "createdBy": "2084",
            "createdAt": "1479321218.145",
            "type": "ContactFilter",
            "criteria": [{
                "type": "ContactFieldCriterion",
                "id": "-4",
                "condition": {
                    "type": "TextSetCondition",
                    "operator": "in",
                    "optionListId": "-4",
                    "quickListString": "Finance,Telecommunications"
                },
                "fieldId": "100046"
            }],
            "statement": "-4",
            "x_e10_isTemplate": "false",
            "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"]
        },
        "id": "-112",
        "type": "ContactFilterSegmentElement"
    }],
    "isBlankTemplate": true,
    "id": "-211",
    "name": "TEST: Leia Created 1479321218138",
    "permissions": ["Retrieve", "Update", "Delete", "SetSecurity"],
    "folderId": "180344",
    "x_e10_isTemplate": "false",
    "depth": "complete"
}
