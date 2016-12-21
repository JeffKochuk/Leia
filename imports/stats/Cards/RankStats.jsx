import React from 'react';

let fakeProps = {
    "Lead Rating": {
        "null": 24636,
        "C4": 17616,
        "D4": 7649,
        "C3": 2712,
        "A2": 198,
        "C2": 687,
        "D2": 952,
        "A4": 793,
        "D3": 2734,
        "B4": 4619,
        "B2": 462,
        "A1": 121,
        "B3": 1377,
        "A3": 526,
        "D1": 517,
        "C1": 328,
        "B1": 276
    },
    "Lead Ranking": {
        "P5": 45130,
        "null": 3978,
        "P4": 7604,
        "P3": 3996,
        "Archiv": 430,
        "P2": 1961,
        "None": 2436,
        "P1": 668
    }
};
const backgroundColors = {
};
['A1','A2','B1','P1'].forEach((x) => backgroundColors[x] = 'rgba(228,244,191,1)');
['A3','B2','C1','P2'].forEach((x) => backgroundColors[x] = 'rgba(201,234,128,1)');
['A4','B3','C2', 'D1', 'P3'].forEach((x) => backgroundColors[x] = 'rgba(109,159,0,1)');
['B4','C3','D2','P4'].forEach((x) => backgroundColors[x] = 'rgba(73,106,0,1)');
['C4','D3','D4','P5'].forEach((x) => backgroundColors[x] = 'rgba(37,53,0,1)');
const fontColors = {
};
['A1','A2','B1','P1'].forEach((x) => fontColors[x] = '#035');
['A3','B2','C1','P2'].forEach((x) => fontColors[x] = '#035');
['A4','B3','C2', 'D1', 'P3'].forEach((x) => fontColors[x] = 'white');
['B4','C3','D2','P4'].forEach((x) => fontColors[x] = 'white');
['C4','D3','D4','P5'].forEach((x) => fontColors[x] = 'white');

const blackBox = ( words, count ) => (
    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'flex-start', margin: '2px'}}>
        <div style={{color: 'white', background: '#444', minWidth: '8rem', display: 'flex', justifyContent: 'center', border: '1px black solid'}}>
            {words}
        </div>
        <div style={{color: '#444', background: 'white', minWidth: '8rem', display: 'flex', justifyContent: 'center', border: '1px black solid'}}>
            {count || '0'}
        </div>
    </div>
);


const getRatingGrid = (rating) => (
    <div className="col m4">
        <span style={{fontSize: '2rem', fontWeight: '300', textAlign: 'center'}}>Lead Rating</span>
        <table>
            <tbody>
                {['A', 'B', 'C', 'D'].map(getGridRow)}
            </tbody>
        </table>
        <div className="divider"></div>
        {blackBox("N/A",rating.null)}
    </div>
);
const getGridRow = (letter, idx) => (
    <tr key={idx}>
        {[4,3,2,1].map((x, index) => getGridDatum(letter + x))}
    </tr>
);
const getGridDatum = (key) => (
    <td key={key} style={{background: backgroundColors[key], border: '1px solid white', padding: '0px'}}>
        <div style={{display: 'flex', flexFlow: 'column nowrap', alignItems: 'center', justifyContent: 'flex-start'}}>
            <div style={{color: 'rgba(128,128,128,0.5)', fontSize: '2.5rem', padding: '0', flexShrink: '1'}}>{key}</div>
            <div style={{color: fontColors[key], fontWeight: 'bold'}}>{fakeProps['Lead Rating'][key] || ''}</div>
        </div>
    </td>
);


const getRankingChart = (ranking) => (
    <div className="col m6 offset-m2">
        <span style={{fontSize: '2rem', fontWeight: '300', textAlign: 'center'}}>Lead Ranking</span>
        <div style={{display: 'flex', flexFlow: 'column nowrap', padding: '2px'}}>
            {['P1','P2','P3','P4','P5'].map(getBar)}
        </div>
        {blackBox("Archived",ranking.Archiv || '0')}
        {blackBox("N/A", (ranking.None || 0) + (ranking.null || 0))}
    </div>
);
const getBar = (key) => (
    <div style={{ display: 'flex', flexFlow: 'row nowrap', alignItems: 'center' }} key={key}>
        <span style={{width: '2rem', fontSize: '1.3rem'}}>{key}</span>
        <div style={{height: '4rem', minWidth: getMinWidthForBar(fakeProps['Lead Ranking'][key]), width: `${Math.ceil(2 + (78 * fakeProps['Lead Ranking'][key] / this.maxValue))}%`, background: backgroundColors[key], color: fontColors[key], display: 'flex', alignItems: 'center', paddingLeft: '2px' }} >
            {fakeProps['Lead Ranking'][key] || '0'}
        </div>
    </div>
);
getMinWidthForBar = (num) => `${`${num}`.length * 0.65}rem`;

export default function RankStats(props) {
    if (Object.keys(props).length) {
        console.log(props);
        fakeProps = props;
    }
    this.maxValue = Math.max(...Object.values(fakeProps['Lead Ranking']));
    return (
        <div className="white row black-text" style={{'borderRadius': '2px', paddingBottom: '1rem'}}>
            {getRatingGrid(fakeProps['Lead Rating'])}
            {getRankingChart(fakeProps['Lead Ranking'])}
        </div>
    )
}

