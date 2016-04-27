import React, { PropTypes } from 'react';

export default function SegmentList({ segments }) {
  if (segments.length) {
    console.log(JSON.stringify(segments));
    return (
      <ul>
        {segments.map((segment) => {
          console.log(JSON.stringify(segment));
          return(<li key={segment._id}> {segment.name} </li>);
        } )}
      </ul>
    );
  } else {
    return (<p> -- No Segments -- </p>);
  }
}

SegmentList.propTypes = { segments: PropTypes.array.isRequired };
