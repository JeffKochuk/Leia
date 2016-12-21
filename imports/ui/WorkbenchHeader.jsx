import React from 'react';
import Search from './Search.jsx';

export default function WorkbenchHeader() {
    const isDev = new RegExp('(dev)|(localhost)').test(window.location.href);
    const devLinks = (
        <ul id='headerMenuDropdown' className='dropdown-content'>
            <li><a href="http://sherlockdev-marketingdev.itos.redhat.com">Sherlock</a></li>
            <li><a href="http://columbodev-marketingdev.itos.redhat.com">Columbo</a></li>
            <li><a href="http://leiadev-marketingdev.itos.redhat.com">Leia</a></li>
            <li><a href="http://tyriondev-marketingdev.itos.redhat.com">Tyrion</a></li>
            <li className="divider"></li>
            <li><a href="http://workbenchlandingdev-marketingdev.itos.redhat.com/feedback">Feedback</a></li>
            <li><a href="http://workbenchlandingdev-marketingdev.itos.redhat.com/changelog">Changelog</a>
            </li>
            <li><a href="http://workbenchlandingdev-marketingdev.itos.redhat.com/reports">Reports</a></li>
            <li className="divider"></li>
            <li><a href="http://workflows-marketing.itos.redhat.com">Workflows</a></li>
        </ul>
    );
    const prodLinks = (
        <ul id='headerMenuDropdown' className='dropdown-content'>
            <li><a href="http://sherlock-marketing.itos.redhat.com">Sherlock</a></li>
            <li><a href="http://columbo-marketing.itos.redhat.com">Columbo</a></li>
            <li><a href="http://leia-marketing.itos.redhat.com">Leia</a></li>
            <li><a href="http://tyrion-marketing.itos.redhat.com">Tyrion</a></li>
            <li className="divider"></li>
            <li><a href="http://workbench-marketing.itos.redhat.com/feedback">Feedback</a></li>
            <li><a href="http://workbench-marketing.itos.redhat.com/changelog">Change Log</a></li>
            <li><a href="http://workbench-marketing.itos.redhat.com/reports">Reports</a></li>
            <li className="divider"></li>
            <li><a href="http://workflows-marketing.itos.redhat.com">Workflows</a></li>
        </ul>
    );
    return (
        <header>
            <div className="header-redhat-logo-beta">
                <a href={isDev
                    ? "http://workbenchlandingdev-marketingdev.itos.redhat.com"
                    : "https://workbench-marketing.itos.redhat.com"}><img style={{maxWidth: '10vw'}}
                                                                          src="/images/updated_ rh-logo.png"/></a>
                <img src="/images/beta.png" style={{
                    maxWidth: '8vw',
                    marginLeft: '2vw',
                    paddingBottom: '3px'
                }}/>
            </div>

            <div className="right-align" style={{
                flexGrow: '1',
                display: 'flex',
                justifyContent: 'flex-end'}}>
                <div
                    style={{maxWidth: '400px', minWidth: '25vw', display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }}>
                    <i className="material-icons white-text">search</i>
                    <Search />
                </div>
            </div>

            <div style={{padding: '0 2vw', display: 'flex', alignItems: 'center', height: '4.2rem'}}>
                <a className="dropdown-button" href='#' data-activates='headerMenuDropdown'
                   data-constrainwidth="false" data-alignment="right" data-belowOrigin="true"><img
                    className="sandwich" src="images/updated_menu-sandwich.png"/> </a>
                {isDev ? devLinks : prodLinks}
            </div>
        </header>
    );
}