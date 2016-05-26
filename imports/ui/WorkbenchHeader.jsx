import React from 'react';
import Search from './Search.jsx';
// <div className="search-wrapper">
export default function WorkbenchHeader() {

  return (
    <header>
      <div className="row">
        <div className="col s3">
            <Search />
        </div>
        <div className="col s1">
          <img src="images/beta.png" className="beta"/>
        </div>
        <div className="col s1 push-s7">
          <a className="dropdown-button" href='#' data-activates='headerMenuDropdown' data-constrainwidth="false" data-alignment="right" data-belowOrigin="true"><img className="right-align" src="images/menu_logo.png"/> </a>
          <ul id='headerMenuDropdown' className='dropdown-content'>
            <li><a href="http://sherlock-marketing.itos.redhat.com">Sherlock</a></li>
            <li><a href="http://columbo-marketing.itos.redhat.com">Columbo</a></li>
            <li className="divider"></li>
            <li><a href="http://workflows-marketing.itos.redhat.com">Workflows</a></li>
            <li><a href="http://workflows-marketing.itos.redhat.com">Feedback</a></li>
            <li><a href="http://workbench-marketing.itos.redhat.com/changelog.html">Change Log</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}