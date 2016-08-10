import React, { PropTypes } from 'react';

export default function Contact({ contact }) {
  return (
    <tr>
      <td style={{width: '20%'}}>{contact.first}</td>
      <td style={{width: '40%'}}>{contact.last}</td>
      <td style={{width: '60%'}}>{contact.email}</td>
    </tr>
  );
}

Contact.propTypes = { contact: PropTypes.object.isRequired };
