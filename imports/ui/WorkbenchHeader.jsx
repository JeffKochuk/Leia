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
            <li><a href="http://workbench-marketing.itos.redhat.com">Workbench</a></li>
            <li><a className="thin" href="http://sherlock-marketing.itos.redhat.com">&nbsp; Sherlock </a></li>
            <li><a className="thin" href="http://columbo-marketing.itos.redhat.com">&nbsp; Columbo </a></li>
            <li className="divider"></li>
            <li><a href="http://workflows-marketing.itos.redhat.com">Workflows</a></li>
          </ul>
        </div>
      </div>
    </header>
  );
}