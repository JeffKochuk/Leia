import React, { PropTypes } from 'react';

export default function Contact({ contact }) {
  return (
    <tr>
      <td>{contact.first}</td>
      <td>{contact.last}</td>
      <td>{contact.email}</td>
    </tr>
  );
}

Contact.propTypes = { contact: PropTypes.object.isRequired };
