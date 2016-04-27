import { Meteor } from 'meteor/meteor';
import { getEloquaData, getEloquaDataPromise, SEGMENTS_URL, CONTACTS_URL } from '../imports/helpers/getEloquaData';
import { Segments, Contacts } from '../imports/collections.js';


// Take an Eloqua response and insert the elements into the Segments collection
const insertSegments = (err, res, body) => {
  for (const obj of body.elements) {
    Segments.insert({ _id: obj.id, name: obj.name });
    // console.log(`inserted Segment: ${obj}`);
  }
};

const insertSegmentsPromise = (body) => {
  for (const obj of body.elements) {
    Segments.insert({ _id: obj.id, name: obj.name });
    // console.log(`inserted Segment: ${obj}`);
  }
};

const insertContactsPromise = (segmentID, body) => {
  console.log(body.total);
  for (const obj of body.elements) {
    Contacts.insert({
//Can't do ID on contact ID because the same contact can be in multiple segments and we need a separate
      first: obj.C_FirstName,
      last: obj.C_LastName,
      email: obj.C_EmailAddress.replace(/.*@/, '***@'),
      segment: segmentID,
    });
  }
};

// Take an Eloqua response and insert the elements into the Contacts collection
const insertContacts = (segmentID, err, res, body) => {
  for (const obj of body.elements) {
    Contacts.insert({
//Can't do ID on contact ID because the same contact can be in multiple segments and we need a separate
      first: obj.C_FirstName,
      last: obj.C_LastName,
      email: obj.C_EmailAddress.replace(/.*@/, '***@'),
      segment: segmentID,
    });
  }
};

const updateSegmentList = () => {
  getEloquaData(SEGMENTS_URL,
    Meteor.bindEnvironment(insertSegments),
    Meteor.bindEnvironment(() => console.log(Segments.find().count())));
};

// Real Functionality starts here
Meteor.startup(() => {   // code to run on server at startup
  if (Segments.find().count() === 0) { // Populate the server with data if it is currently empty.
    console.log('Populating Segments');
    Segments._ensureIndex({ name: 1 });
    updateSegmentList();
     // @TODO Maybe Populate Contacts for the 1000 most recent lists
    Contacts._ensureIndex({ segment: 1 });
  }
  const updateSegmentsEveryMorning = new Cron(updateSegmentList, { minute: 0, hour: 1 });
  // @TODO start a cron job to refresh segments
});

Meteor.publish('contacts', (segmentID) => Contacts.find({ segment: segmentID }));
Meteor.publish('segments', () => Segments.find());

Meteor.methods({
  // Search for a set of contacts given a segment's ID
  // returns a promise
  // Use .done() on the returned promise to deal with the asyncness
  updateContacts: segmentID => {
    Segments.update({ _id: segmentID }, { $set: { lastSearched: new Date() } });
    const eloquaReturn = getEloquaDataPromise(CONTACTS_URL + segmentID, Meteor.bindEnvironment(insertContactsPromise.bind(undefined, segmentID))); // Search returned event? Publish?
    console.log(eloquaReturn);
    if (eloquaReturn === 0) {
      console.log('This Segment is Empty???');
    }
    return eloquaReturn;
  },
  getSegmentByName: name => {
    console.log(name);
    console.log(Segments.find({ name }).fetch()[0]);
    return Segments.find({ name }).fetch()[0];
  },
});
