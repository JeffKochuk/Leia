/**
 * Created by jkochuk on 10/3/16.
 */

import { Meteor } from 'meteor/meteor';
import { queryDB } from '../imports/helpers/mysql.js';

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
            console.log('AreasOfInterest NOT IMPLEMENTED');
            //whereClauses.push(`areasOfInterest IN ('${formData.areasOfInterest.join("','")}')`);
        }
        if (formData.interestSource.length) {
            //@todo figure out how to implement this
            console.log('interestSource DOESNT DO ANYTHING RIGHT NOW');
            // whereClauses.push(`interestSource IN ('${formData.areasOfInterest.join("','")}')`);
        }
        if (formData.activeUsers == true) {
            //@Todo figure this out
            console.log('activeUsers DOESNT DO ANYTHING RIGHT NOW');
        }
        if (formData.personas.length) {
            whereClauses.push(`persona IN ('${formData.personas.join("','")}')`);
        }
        if (formData.completeness == true) {
            //@TODO figure this out
            console.log('Completeness doesn\'t do anything!');
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
            const connection = getConnection();
            queryDB(query)
                .then()
            
            
        } else {
            throw new Meteor.Error('Need more details');
        }
    }
});

handle