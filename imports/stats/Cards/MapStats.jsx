import React from 'react';
import MapContainer from './MapContainer.jsx';
import StatCard from './FixedWidthStatCard.jsx';


export default function MapStats(props) {
    console.log('MAPS PART HERE');
    return (
        <div>
            <MapContainer {...props['Country']} />
            <StatCard name='Language' data={props['Language']} />
        </div>
    )
}
