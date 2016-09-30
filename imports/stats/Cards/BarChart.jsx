import React from 'react';

export default function BarChart(props) {
    console.log('BarChartProps', props);
    const sum = props.data.reduce((all, next) => all + next.value, 0);
    console.log('sum', sum);
    return (
        <div className="Chart">
            {props.data.map((keyValPair, idx) => (
                <div key={idx} className="barHolder">
                    <span>{keyValPair.key}</span>
                    <div style={{width: `${Math.ceil(100 * keyValPair.value / sum)}%`}}>&nbsp;</div>
                </div>
            ))}
        </div>
    );
}