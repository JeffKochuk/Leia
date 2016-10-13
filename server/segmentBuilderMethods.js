/**
 * Created by jkochuk on 10/3/16.
 */

import { Meteor } from 'meteor/meteor';
import { getConnection } from '../imports/helpers/mysql.js';
import promisify  from 'es6-promisify';
import { accumulateStats } from '../imports/helpers/stats.js';

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
Meteor.methods({
    segmentBuilderBuildOriginalStats(formData) {
        let query = 'select * from contacts';
        let whereClauses = [];
        if (formData.areasOfInterest.length ) {
            console.log('AreasOfInterest NOT TESTED');
            whereClauses.push(`areasOfInterest IN ('${formData.areasOfInterest.join("','")}')`);
        }
        if (formData.interestSource && formData.interestSource.length) {
            //@todo figure out how to implement this
            console.log('interestSource DOESNT DO ANYTHING RIGHT NOW');
            // whereClauses.push(`interestSource IN ('${formData.interestSource.join("','")}')`);
        }
        if (formData.activeUsers == true) {
            //@Todo figure this out
            console.log('activeUsers DOESNT DO ANYTHING RIGHT NOW');
        }
        if (formData.personas.length) {
            whereClauses.push(`persona IN ('${formData.personas.join("','")}')`);
        }
        if (formData.completeness == true) {
            whereClauses.push("completenessLevel = 'High'");
        }
        if (formData.geography) {
            console.log('Geography doesn\'t do anything');
        }
        if (formData.industry.length) {
            whereClauses.push(`industry IN ('${formData.industry.join("','")}')`);
        }

        if (whereClauses.length) {
            query = query + ' where ' + whereClauses.join(' AND ');
            console.log(query);
            //@todo remove this LIMIT once you have indices in place
            query = query + ' LIMIT 1000';
            const connection = getConnection();
            const queryDB = promisify(connection.query, connection);
            const queryReturn = queryDB(query)
                .then((rows) => {
                    console.log(rows.length);
                    return rows;
                })
                .await();

            const stats = accumulateStats( queryReturn, 'mysql', null);
            // console.log(stats);
            const segment = {
                stats,
                total: queryReturn.length
            };
            
            return segment;
            
        } else {
            throw new Meteor.Error('Need more details');
        }
    },
    segmentBuilderSaveToEloqua(formData){
        const placeToPostTo = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment';
        const thenQueue = 'https://secure.p01.eloqua.com/API/REST/2.0/assets/contact/segment/queue/22870';
        const template = {
            "createdBy": "2084",
            "createdAt": "1476197319",
            "updatedBy": "2084",
            "updatedAt": "1476197319",
            "currentStatus": "Draft",
            "type": "ContactSegment",
            "elements": [
                {
                    "isIncluded": "true",
                    "filter": {
                        "name": "Filter Criteria 1",
                        "scope": "local",
                        "id": "-1500197",
                        "createdBy": "2084",
                        "createdAt": "1476197359",
                        "type": "ContactFilter",
                        "criteria": [
                            {
                                "type": "ContactFieldCriterion",
                                "id": "-1500199",
                                "fieldId": "100343",
                                "condition": {
                                    "type": "TextValueCondition",
                                    "id": "-1500201",
                                    "operator": "contains",
                                    "value": "Cloud Computing"
                                }
                            },
                            {
                                "type": "ContactFieldCriterion",
                                "id": "-1500202",
                                "fieldId": "100343",
                                "condition": {
                                    "type": "TextValueCondition",
                                    "id": "-1500204",
                                    "operator": "contains",
                                    "value": "JBoss"
                                }
                            }
                        ],
                        "statement": "-1500199 OR -1500202",
                        "x_e10_isTemplate": "false",
                        "permissions": [
                            "Retrieve",
                            "Update",
                            "Delete",
                            "SetSecurity"
                        ]
                    },
                    "id": "-1500198",
                    "type": "ContactFilterSegmentElement"
                }
            ],
            "isBlankTemplate": true,
            "id": "-1500196",
            "name": "TestRest2",
            "permissions": [
                "Retrieve",
                "Update",
                "Delete",
                "SetSecurity"
            ],
            "folderId": "180344",
            "x_e10_isTemplate": "false",
            "depth": "complete"
        }


    }
});

const handleRows = () => null;