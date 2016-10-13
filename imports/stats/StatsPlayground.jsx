/**
 * Created by jkochuk on 9/13/16.
 */
import React from 'react';
import StatCard from './Cards/StatCard.jsx';
import ContactList from '../ContactList.jsx';
import SpecificStatsPlayground from './SpecificStatsPlayground.jsx';

// props:
// {
//   data: {}
//   total: int
//   dataSample: []
// }
export default function StatsPlayground (props) {
    const { Country, Language, ...rest } = props.stats;
    const mapData = { Country, Language };
    const rankData = {
        'Lead Rating': props.stats['Lead Rating'],
        'Lead Ranking': props.stats['Lead Ranking']
    };
    const companyData = {
        'Company': props.stats.Company,
        'Company Size': props.stats['Company Size'],
        'Persona': props.stats.Persona,
        'Industry': props.stats.Industry
    };
    const toggleViewingDataRows = () => {
        // @todo implement this
        console.log('SWITCH DATA ROWS');
    };

    const refreshStats = () => {
        // @todo implement this
        console.log('SWITCH STATS');
    };
    const showStatsCards = (props) => {
        console.log('Showing Stats',props);
        return (
            <div className="stats-container">
                {Object.keys(props).map((stat, idx) => (<StatCard key={idx} name={stat} data={props[stat]} />))}
            </div>);
    };

    console.log('Rendering StatsPlayground', props);
    return (
        <div>
            <div className="row center-align">
                <div className="input-field col s4 right-align">
                    <p className="white-text"> Contacts: {props.total || ' - -'}</p>
                </div>
                <div className="input-field col s1 left-align">
                    {props.dataSample ? <button onClick={toggleViewingDataRows} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">reorder</i></button> : null}
                </div>
                <div className="input-field col s4 right-align">
                    <p className="white-text"> Last Updated: {props.lastRefreshed ? props.lastRefreshed.toLocaleString() : ' - -'}</p>
                </div>
                <div className="input-field col s3 left-align">
                    {props.lastRefreshed ? <button onClick={refreshStats} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">autorenew</i></button> : null}
                </div>
            </div>

            <div className="divider"></div>
            <h4> Rank Data </h4>
            {showStatsCards(rankData)}
            <div className="divider"></div>
            <h4> Companies </h4>
            {showStatsCards(companyData)}
            <div className="divider"></div>
            <h4> Map </h4>
            <SpecificStatsPlayground Country={Country} Language={Language} />

        </div>
    );
}
//
// <div className="input-field col s4 right-align">
//     <p className="white-text"> Contacts: {props.total || ' - -'}</p>
// </div>
// <div className="input-field col s1 left-align">
// {props.dataSample ? <button onClick={toggleViewingDataRows} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">reorder</i></button> : null}
// </div>
// <div className="input-field col s4 right-align">
//     <p className="white-text"> Last Updated: {props.lastRefreshed ? props.lastRefreshed.toLocaleString() : ' - -'}</p>
//     </div>
//     <div className="input-field col s3 left-align">
//     {props.lastRefreshed ? <button onClick={refreshStats} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">autorenew</i></button> : null}
// </div>

// {(props.viewingDataRows && props.dataSample) ? <ContactList data={props.dataSample} name={props.name} /> : showStatsCards(rest) }
