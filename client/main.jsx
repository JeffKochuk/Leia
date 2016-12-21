import React from 'react';
import {Meteor} from 'meteor/meteor';
import {render} from 'react-dom';
import WorkbenchHeader from '../imports/ui/WorkbenchHeader.jsx';
import WorkbenchFooter from '../imports/ui/WorkbenchFooter.jsx';
import SegmentSearchApp from '../imports/SegmentSearchApp.jsx';
import {BrowserRouter, Match, Link} from 'react-router';
import SegmentBuilderAppOld from '../imports/SegmentBuilderApp.jsx';
import SegmentBuilderApp from '../imports/SegmentBuilderAppV2.jsx';
import SegmentLandingPage from '../imports/SegmentLandingPage.jsx';

Meteor.startup(() => {
    render(<LeiaRouter />, document.getElementById('root'));
});

Bert.defaults.hideDelay = 7000;

const LeiaRouter = () => (
    <BrowserRouter>
        <div>
            <WorkbenchHeader />
            <main>
                <Match exactly pattern="/" component={SegmentLandingPage}  />
                <Match pattern="/search"   component={SegmentSearchApp}    />
                <Match pattern="/build"    component={SegmentBuilderApp}   />
                <Match pattern="/build2"   component={SegmentBuilderAppOld}/>
            </main>
            <WorkbenchFooter />
        </div>
    </BrowserRouter>
);