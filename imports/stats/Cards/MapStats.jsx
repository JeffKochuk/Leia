import React from 'react';
import MapContainer from './MapContainer.jsx';
import StatCard from './FixedWidthStatCard.jsx';


export default function MapStats(props) {
    console.log('MAPSTATS', props);
    return (
        <div style={{'border-radius': '3px'}}>
            <MapContainer {...props['Country']} />
            <StatCard name={'Language'} data={props['Language']} />
        </div>
    )
}
