import React, { PropTypes } from 'react';
import Contact from './Contact.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Session } from 'meteor/session';
import LoadingBar from './LoadingBar.jsx';


function ContactList({ data, name, loading }) {

  return (
    <div>
      <LoadingBar loading={loading} />
      <table className="striped">
        <thead >
          <tr className="WBRedBackground white-text">
            <th data-field="first" style={{width: '20%'}}>First</th>
            <th data-field="last" style={{width: '40%'}}>Last</th>
            <th data-field="email" style={{width: '60%'}}>Email</th>
          </tr>
        </thead>
      </table>
      <div className="tableDiv">
        <table className="striped bordered">
          <tbody className="white">
            {data.map((contact, index) => (<Contact key={index} contact={contact} />))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default createContainer(() => {
  return ({
    loading: Session.get('loading'),
  });
}, ContactList);
