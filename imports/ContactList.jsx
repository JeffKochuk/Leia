import React, { PropTypes } from 'react';
import Contact from './Contact.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Contacts } from './collections.js';
import { Session } from 'meteor/session';
import LoadingBar from './LoadingBar.jsx';


function ContactList({ loading, contacts, name, count }) {
  if (Session.get('segment')._id === '0') return null;
  if (contacts.length) {
    return (
      <div>
        <LoadingBar loading={loading} />
        <p className="white-text regular"> {count} contacts in segment : {name} </p>
        <table className="striped">
          <thead >
          <tr className="red darken-2 white-text">
            <th data-field="first">First</th>
            <th data-field="last">Last</th>
            <th data-field="email">Email</th>
          </tr>
          </thead>
          <tbody className="white">
          {contacts.map((contact) => (<Contact key={contact._id} contact={contact} />))}
          </tbody>
        </table>
      </div>
    );
  }
  // If no contacts in segment but still loading...
  if (loading) {
    return (
      <div>
        <LoadingBar loading={loading} />
        <p className="white-text regular"> Loading Contacts : {name} </p>
      </div>
    );
  }
  // If Not Loading and No Contacts in Segment
  return <p className="white-text"> No Contacts in Segment </p>;
}

ContactList.propTypes = {
  contacts: PropTypes.array.isRequired,
  loading: PropTypes.bool,
  name: PropTypes.string,
  count: PropTypes.number.isRequired,
};

export default createContainer(({ params }) => {
  const { segment } = params;
  Meteor.subscribe('contacts', segment._id, {
    onReady: () => {
      console.log(`There are ${Contacts.find().count()} Contacts here`);
      console.log(`Segment: ${segment._id}`);
      if (segment._id !== '0' && Contacts.find().count() === 0) { // If the segment exists and there are no Contacts,
        console.log('Segment Found but no Contacts. Trying to update');
        Meteor.call('updateContacts', segment._id, () => {
          console.log('Done Updating Contacts');
          Session.set('loading', false);
        });
      } else {
        Session.set('loading', false);
      }
    },
  });
  const contacts = Contacts.find().fetch();
  const count = Contacts.find().count();
  return ({
    loading: Session.get('loading'),
    contacts,
    count,
    name: segment.name,
  });
}, ContactList);
