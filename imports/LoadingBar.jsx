import React, { PropTypes } from 'react';

export default function LoadingBar({ loading }) {
  if (loading) {
    return (
      <div className="progress">
        <div className="indeterminate"></div>
      </div>
    );
  }
  return null;
}

LoadingBar.propTypes = { loading: PropTypes.bool.isRequired };
