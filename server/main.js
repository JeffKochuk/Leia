import { Meteor } from 'meteor/meteor';
import { getEloquaDataPromise, getEloquaDataResults, getOneEloquaPage, SEGMENTS_URL, CONTACTS_URL } from './getEloquaData.js';
import { Segments, EloquaLogs, Logs } from '../imports/collections.js';
import { Restivus } from 'meteor/nimble:restivus';
import { accumulateStats } from '../imports/helpers/stats.js';

// Take an Eloqua response and insert the elements into the Segments collection
// Use with getEloquaResponse
const insertSegments = Meteor.bindEnvironment( (body) => {
  for (const obj of body.elements) {
    Segments.upsert({ _id: obj.id }, { $set: { _id: obj.id, name: obj.name } });
  }
});


// Called Daily to upsert new segment IDs
export const updateSegmentList = Meteor.bindEnvironment( () => {
  getEloquaDataPromise(SEGMENTS_URL, insertSegments).await();
});

///////////////
//
// Meteor Startup code
//
///////////////
Meteor.startup(() => {
  if (Segments.find().count() === 0) { // Populate the server with data if it is currently empty.
    console.log('Populating Segments');
    Segments._ensureIndex({ name: 1 });
    updateSegmentList();
  }
  const updateSegmentsEveryMorning = new Cron(updateSegmentList, { minute: 0, hour: 1 });
});

////////////////
//
// Meteor.Methods here
//
////////////////
Meteor.methods({
  // Given a segment name,
  // See if we have it in the record.
  // If we do have it,
  // See if we have updated it in the last day.
  // If we have, return the cached copy from Contacts
  // Otherwise, get the data from Eloqua and return that
  // getContactsOfSegmentByName: name => {
  //   const cursor = Segments.find({ name });
  //   if (cursor.count() === 0) {
  //     throw new Meteor.Error(`Could Not Find Segment Name: ${name}`);
  //   }
  //   const segment = cursor.fetch()[0];
  //   if (segment.lastSearched && new Date() - segment.lastSearched < 1000*60*60*24){
  //     console.log(`Segment ${name} was searched within a day: ${segment.lastSearched}`);
  //     if(segment.cache){
  //       Logs.insert({
  //         type: 'Lookup',
  //         input: name,
  //         records: segment.cache.length,
  //         date: new Date()
  //       });
  //       return segment.cache;
  //     } else {
  //       console.log('Last Searched was here but segment Cache was undefined');
  //     }
  //   }
  //
  //   const results = getEloquaDataResults(`${CONTACTS_URL}/${segment._id}`)
  //     .catch((err) => console.log("You probably forgot to add the AUTHORIZATION environment variable or gave a bad URL:::\n" + err))
  //     .await();
  //   Logs.insert({
  //     type: 'Lookup',
  //     input: name,
  //     records: results.length,
  //     date: new Date()
  //   });
  //   const retArray = results.map(obj => ({
  //     first: obj.C_FirstName,
  //     last: obj.C_LastName,
  //     email: obj.C_EmailAddress.replace(/.*@/, '***@'),
  //   }));
  //
  //   Segments.update({ _id: segment._id },
  //     { $set:
  //       { lastSearched: new Date(),
  //         cache: retArray
  //       }
  //     });
  //   return retArray;
  // },

  //Get a segment's contacts and accumulate stats
  getSegmentStatsByName(name) {
    //Log lookup
    Logs.insert({
      type: 'Lookup',
      input: name,
      records: 1,
      date: new Date()
    });
    //If we have the stats of the segment cached, return the existing results.
    const segment = Segments.findOne({ name });
    if (!segment) {
      throw new Meteor.Error(`Could Not Find Segment Name: ${name}`);
    }
    if (segment.stats) {
      return segment;
    }
    console.log(segment);
    // Otherwise start to build and then return the stats
    return Meteor.call('getSegmentStats', segment);
  },

  getSegmentStats(segment) {
    const firstPage = getOneEloquaPage(segment['_id']).await();
    segment.total = firstPage.total;
    segment.stats = accumulateStats(firstPage.elements, 'eloqua', null);
    if (firstPage.total > 1000) {
      
      const N = Math.ceil((firstPage.total - 1) / 1000);
      const promArray = [];
      for (let i = 2; i <= N; i++) {
        promArray.push(getOneEloquaPage(segment['_id'], i).then((res) => accumulateStats(res.elements, 'eloqua', segment.stats)));
      }
      Promise.all(promArray).await();
    }
    // Update the Cache
    segment.lastRefreshed = new Date();
    segment.dataSample = firstPage.elements.slice(0,40).map(row => ({
      first: row.C_FirstName,
      last: row.C_LastName,
      email: row.C_EmailAddress.replace(/.*@/, '***@')
    }));
    Segments.update({'_id': segment['_id']}, segment);
    return segment;
  }
});




/////////////
//
// Rest API starts here
//
/////////////
const RESTAPI = new Restivus({
  apiPath: 'ws',
  defaultHeaders: {
    'Content-Type': 'application/json'
  },
  prettyJson: true,
});

// ADMIN UTILITY to refresh data
//https://...com/ws/refresh
// Use Eloqua Credentials in header
RESTAPI.addRoute('refresh',{
  post: function () {
    if (this.request.headers.authorization === process.env.AUTHORIZATION){
      console.log('Well Authorized, good sirs! Refreshing Data!');
      updateSegmentList();
      return {
        statusCode: 200,
        body: 'Success!'
      };
    } else{
      console.log('/ws/refresh was activated but the authorization was incorrect');
      console.log(this.request.headers.authorization);
      console.log(process.env.AUTHORIZATION);
      return { statusCode: 401 };
    }
  }
});

//http:/...com/ws/eloquaCallsInLastNDays/:days
RESTAPI.addRoute('eloquaCallsInLastNDays/:days',{
  get: function () {
    let startDate = new Date();// Current Date
    const days = this.urlParams.days;
    startDate.setDate(startDate.getDate() - days); // Subtract N Days
    startDate.setHours(0);  // Set the hour, minute and second components to 0
    startDate.setMinutes(0);
    startDate.setSeconds(0);
    const count = EloquaLogs.find({ date: {$gte: startDate } }).map((doc) => Math.ceil(doc.numPagesToGet)).reduce((a, b) => a + b, 0);
    return { days, count };
  }
});

// http://...com/ws/PathCodes
// http://...com/ws/PathCodes/:id
RESTAPI.addCollection(Segments, {
  excludedEndpoints: ['post', 'put', 'delete'],
});

RESTAPI.addCollection(EloquaLogs, {
  excludedEndpoints: ['post', 'put', 'delete'],
});

// Get a report of contacts looked up
RESTAPI.addRoute('usageReport', {
  get: function () {
    const oneDay = new Date();// Current Date
    oneDay.setDate(oneDay.getDate() - 1); // Subtract N Days
    const sevenDays = new Date();// Current Date
    sevenDays.setDate(sevenDays.getDate() - 7); // Subtract N Days
    const fourteenDays = new Date();// Current Date
    fourteenDays.setDate(fourteenDays.getDate() - 14); // Subtract N Days
    const thirtyDays = new Date();// Current Date
    thirtyDays.setDate(thirtyDays.getDate() - 30); // Subtract N Days
    const threeSixtyFiveDays = new Date();// Current Date
    threeSixtyFiveDays.setDate(thirtyDays.getDate() - 365); // Subtract N Days
    const REDUCE_SUM = (a, b) => a + b;
    const lastDay = Logs.find({type: 'Lookup',date: {$gte: oneDay } });
    const lastWeek = Logs.find({type: 'Lookup',date: {$gte: sevenDays } });
    const lastTwoWeeks = Logs.find({type: 'Lookup',date: {$gte: fourteenDays } });
    const lastMonth = Logs.find({type: 'Lookup',date: {$gte: thirtyDays } });
    const lastYear = Logs.find({type: 'Lookup',date: {$gte: threeSixtyFiveDays } });
    return {
      contactsFound: {
        lastDay: lastDay.map((doc) => doc.records).reduce(REDUCE_SUM, 0),
        lastWeek: lastWeek.map((doc) => doc.records).reduce(REDUCE_SUM, 0),
        lastTwoWeeks: lastTwoWeeks.map((doc) => doc.records).reduce(REDUCE_SUM, 0),
        lastMonth: lastMonth.map((doc) => doc.records).reduce(REDUCE_SUM, 0),
        lastYear: lastYear.map((doc) => doc.records).reduce(REDUCE_SUM, 0)
      },
      uses: {
        lastDay: lastDay.count(),
        lastWeek: lastWeek.count(),
        lastTwoWeeks: lastTwoWeeks.count(),
        lastMonth: lastMonth.count(),
        lastYear: lastYear.count()
      }
    }
  }
});

