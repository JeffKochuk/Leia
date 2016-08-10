import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import WorkbenchHeader from '../imports/ui/WorkbenchHeader.jsx';
import App from '../imports/App.jsx';

Meteor.startup(() => {
  render(<WorkbenchHeader />, document.getElementById('header'));
  render(<App />, document.getElementById('main'));
});

Bert.defaults.hideDelay = 7000;