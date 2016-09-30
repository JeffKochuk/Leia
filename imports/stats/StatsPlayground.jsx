/**
 * Created by jkochuk on 9/13/16.
 */
import React from 'react';
import StatCard from './Cards/StatCard.jsx'

export default function StatsPlayground (props) {
    return (
        <div className="stats-container">
            {Object.keys(props).map((stat, idx) => (<StatCard key={idx} name={stat} data={props[stat]} />))}
        </div>
    );
}