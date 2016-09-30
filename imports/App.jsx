import React, { PropTypes, Component } from 'react';
import ContactList from './ContactList.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';
import StatsPlayground from './stats/SpecificStatsPlayground.jsx'

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
    };
    Session.set({ 
      loading: false,
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.toggleViewingDataRows = this.toggleViewingDataRows.bind(this);
  }
  handleRefresh(e) {
    Session.set({loading: true});
    Meteor.call('getSegmentStats', {'_id': this.state['_id'], name: this.state.name}, function (err,result) {
      Session.set({ loading: false });
      if (err) {
        console.log('ERROR: ' + err.error);
        Bert.alert(err.error, 'danger', 'growl-top-right');
      } else {
        this.setState(result);
      }
    }.bind(this));
  }
  handleSubmit(event) {
    event.preventDefault();
    const search = document.getElementById('segment-name-input').value.trim();
    if(search){
      Session.set({
        loading: true,
      });
      console.log(`Searching Segments for ${search}`);
      Meteor.call('getSegmentStatsByName', search, function (err, result) {
        Session.set({
          loading: false
        });
        if(err){
          console.log('ERROR: ' + err.error)
          Bert.alert(err.error, 'danger', 'growl-top-right');
        } else {
          console.log(result);
          this.setState(result);
        }
      }.bind(this));
    }
  }

  handleKey(event){
    if(event.key == 'Enter'){
      this.handleSubmit(event);
    }
  }

  toggleViewingDataRows() {
    this.setState({viewingDataRows: !this.state.viewingDataRows});
  }

  render() {
    console.log(StatsPlayground);
    return (
      <div>
        <h4 className="white-text center-align">Who makes up your Eloqua segments?</h4>
        <h3 className="WBRed center-align"> Ask Leia</h3>
        <div className="row">
          <form className="segmentSearch white-text container" onSubmit={this.handleSubmit} >
            <div className="input-field col s10 ">
              <input
              id="segment-name-input"
              type="text"
              ref="textInput"
              placeholder="Enter Segment Name"
              className="white-text"
              onKeyPress={this.handleKey}
              />
            </div>
            <div className="input-field col s2 ">
              <a
                onClick={this.handleSubmit}
                className="btn-floating WBRedBackground waves-effect waves-light white-text"
              ><i className="material-icons">search</i></a>
            </div>
          </form>
        </div>
        <div className="row center-align">
          <div className="input-field col s4 right-align">
            <p className="white-text"> Contacts: {this.state.total || ' - -'}</p>
          </div>
          <div className="input-field col s1 left-align">
            {this.state.lastRefreshed ? <button onClick={this.toggleViewingDataRows} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">reorder</i></button> : null}
          </div>
          <div className="input-field col s4 right-align">
            <p className="white-text"> Last Updated: {this.state.lastRefreshed ? this.state.lastRefreshed.toLocaleString() : ' - -'}</p>
          </div>
          <div className="input-field col s3 left-align">
            {this.state.lastRefreshed ? <button onClick={this.refreshStats} className="btn-floating WBRedBackground waves-effect waves-light white-text"><i className="material-icons">autorenew</i></button> : null}
          </div>
        </div>
        {this.state.loading ? <div className="progress"><div className="indeterminate"></div></div> : null}
        {this.state.viewingDataRows ? <ContactList data={this.state.dataSample} name={this.state.name} /> : <StatsPlayground {...this.state.stats} /> }

      </div>
    );
  }
}
