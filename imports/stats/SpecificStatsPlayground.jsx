/**
 * Created by jkochuk on 9/13/16.
 */
import React from 'react';
import RankStats from './Cards/RankStats.jsx';
import MenuBar from '../ui/MenuBar.jsx';
import MapContainer from './Cards/MapContainer.jsx';
import MapStats from './Cards/MapStats.jsx';

export default class StatsPlayground extends React.Component {
    constructor() {
        super();
        this.state = { selected: 2 };
        this.getStatPlayground = this.getStatPlayground.bind(this);
        this.selectOne = this.selectOne.bind(this);
    }

    selectOne(x) {
        this.setState({ selected: x });
    }

    getStatPlayground() {
        console.log('State 2:', this.state.selected);
        if ( !this.props['Country']) return null;
        if (this.state.selected === 0) {
            console.log('RankStats');
            return (<RankStats rating={this.props['Lead Rating']} ranking={this.props['Lead Ranking']}/>);
        } else if (this.state.selected === 1) {
            return null //<PeopleStats />
        } else if (this.state.selected === 2) {
            console.log('Getting 2');
            return  <MapStats Country={this.props.Country} Language={this.props.Language} />
        } else if (this.state.selected === 3) {
            return null //<DataSample />
        }
        return 'OOPS';
    }


    render() {
        console.log('SSP', this.props);
        return (
            <div className="card row black-text" style={{'borderRadius': '2px'}}>
                {this.getStatPlayground()}

            </div>
        );
    }
}