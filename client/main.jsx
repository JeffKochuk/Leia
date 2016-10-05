import React from 'react';
import { Meteor } from 'meteor/meteor';
import { render } from 'react-dom';
import WorkbenchHeader from '../imports/ui/WorkbenchHeader.jsx';
import App from '../imports/App.jsx';
import { BrowserRouter, Match, Link } from 'react-router';
import SegmentBuilderApp from '../imports/SegmentBuilderApp';

Meteor.startup(() => {
  render(<LeiaRouter />, document.getElementById('main'));
});

Bert.defaults.hideDelay = 7000;

console.log(BrowserRouter, Match, Link);

const LeiaRouter = () => (
    <BrowserRouter>
      <div>
        <WorkbenchHeader />
        <Match exactly pattern="/" component={App} />
        <Match pattern="/builder" component={SegmentBuilderApp}/>
        <br/>
      </div>
    </BrowserRouter>
);