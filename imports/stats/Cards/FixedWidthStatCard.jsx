/**
 * Created by jkochuk on 9/13/16.
 */
import React from 'react';

const compressData = (data) => {
    const sortedKeys = Object.keys(data)
        .filter((str) => str !== 'null' && str !== 'Other')
        .sort((a,b) => data[b] - data[a] );
    const thirdHighestValue =  data[sortedKeys[Math.min(sortedKeys.length, 2)]];
    console.log(data, sortedKeys, thirdHighestValue);
    const smallerList = Object.keys(data).filter((item) => data[item] >= thirdHighestValue);
    let delta = Object.keys(data).length - smallerList.length;
    const compressedObj = {};
    smallerList.forEach((key) => {
        if (key === null || key === 'null') {
            console.log(key);
            delta += data[key];
        } else {
            compressedObj[key] = data[key];
        }
    });
    if (delta) {
        compressedObj['Other'] = (compressedObj['Other'] || 0) + delta;
        return compressedObj
    }
    // If We didn't remove anything, there is no compressed data to save.
    return null;
};

const getPercentData = (data) => {
    const total = Object.values(data).reduce((a,b) => a + b, 0);
    const percentData = {};
    Object.keys(data).forEach((key) => {
        percentData[key] = `${Math.ceil((data[key] / total) * 100)}%`;
    });
    return percentData;
};

export default class StatCard extends React.Component {
    constructor({ data }) {
        super();
        this.state = {
            view: 1 //1: Count, 2: Expanded, 3: percent
        };
        // console.log('hello');
        this.expandedData = data;
        // console.log('expanded sorted: ', this.expandedData);
        this.compressedData = compressData(this.expandedData);
        // console.log('compressed sorted: ', this.compressedData);
        this.percentData = getPercentData(this.compressedData);
        this.toggleExpand = this.toggleExpand.bind(this);
        this.toggleCount = this.toggleCount.bind(this);
        this.togglePercent = this.togglePercent.bind(this);

    }
    
    toggleCount() {
        this.setState({ view: 1 });
    }

    toggleExpand() {
        this.setState({ view: 2 });
    }

    togglePercent() {
        this.setState({ view: 3 });
    }

    render() {
        let activeData = this.compressedData;
        if (this.state.view === 2) {
            activeData = this.expandedData;
        } else if (this.state.view === 3) {
            activeData = this.percentData;
        }
        return (
            <div className="col s12 m4">
                <div className="card-content center-align">
                    <span className="card-title">{this.props.name}</span>
                    <div className="card-container">
                        <table className="bordered">
                            <tbody>
                            { Object.keys(activeData)
                                .sort((a, b) => {
                                    if (a == 'Other' || a === null || a === 'null') return 1;
                                    if (b == 'Other' || b === null || b === 'null') return -1;
                                    return parseInt(activeData[b]) - parseInt(activeData[a]);
                                })
                                .map((entry, idx) => (
                                    <tr key={idx}>
                                        <td>{entry}</td>
                                        <td className="left-align">{activeData[entry]}</td>
                                    </tr>)
                                )
                            }
                            </tbody>
                        </table>
                    </div>
                    <div className="divider"></div>
                    <div className="WBRed row card-bottom">
                        <div className="col s2 offset-s4 center-align">
                            <button className={"tiny-button-" + (this.state.view === 1 ? 'active' : 'inactive' )} onClick={this.toggleCount}>1</button>
                        </div>
                        <div className="col s2 center-align">
                            <button className={"tiny-button-" + (this.state.view === 2 ? 'active' : 'inactive' )} onClick={this.toggleExpand}>+</button>
                        </div>
                        <div className="col s2 center-align">
                            <button className={"tiny-button-" + (this.state.view === 3 ? 'active' : 'inactive' )} onClick={this.togglePercent}>%</button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}