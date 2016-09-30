import React from 'react';
import BarChart from './BarChart.jsx';

export default function RankStats (props) {
    console.log('RankStats',props);
    const getTableBody = () => {
        const nums = [4,3,2,1];
        const letters = ['A','B','C','D'];
        return letters.map((letter, idx) =>
            (<tr key={idx}>
                {nums.map((num,idx) => (
                    <td key={idx}>{`${letter}${num}: ${props.rating[letter + num] || 0}`}</td>
                ))}
            </tr>)
        )
    };
    const ranking = Object.keys(props.ranking)
        .filter((key) => /^P.$/.test(key))
        .sort()
        .map((key) => ({key, value: props.ranking[key]}));
    console.log("filtered ranking", ranking);
    return (
        <div className="row" style={{background: '#EEE'}}>
            <div className="col s6">
                <table>
                    <tbody>
                        {props.rating ? getTableBody() : null}
                    </tbody>
                </table>
            </div>
            <div className="col s6">
                <BarChart data={ranking} />
            </div>

        </div>
    )
}

