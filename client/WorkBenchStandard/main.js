import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import WorkbenchHeader from '../../imports/ui/WorkbenchHeader.jsx';
import WorkbenchFooter from '../../imports/ui/WorkbenchFooter.jsx';

Meteor.startup(() => {
  // render(<>, document.getElementById('main'));
  render(<WorkbenchHeader />, document.getElementById('header'));
  render(<WorkbenchFooter />, document.getElementById('footer'));
});

