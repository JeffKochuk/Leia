import React from 'react';
import { Link } from 'react-router';

export default function SegmentLandingPage() {
    return (
        <div>
            <h4 className="white-text center-align">What contacts are in your Eloqua segments?</h4>
            <h3 className="WBRed center-align"> Ask Leia</h3>
            <br />
            <div className="row">
                <div className="col s3 offset-s3 center-align">
                    <Link to="/search" className="waves-effect waves-light">
                        <img src="/images/card-search.jpg" className="menu-card" />
                    </Link>
                </div>
                <div className="col s3 center-align">
                    <Link to="/build"  className="waves-effect waves-light">
                        <img src="/images/card-build.jpg" className="menu-card" />
                    </Link>
                </div>
            </div>
        </div>
    )
}