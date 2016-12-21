import React, { PropTypes, Component } from 'react';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';
import StatsPlayground from './stats/StatsPlayground.jsx';

export default class SegmentSearchApp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKey = this.handleKey.bind(this);
    this.toggleViewingDataRows = this.toggleViewingDataRows.bind(this);
    this.refreshStats = this.refreshStats.bind(this);
  }

  refreshStats() {
    this.setState({ loading: true });
    Meteor.call('getSegmentStats', { name: this.state.name, _id: this.state._id }, function (err,result) {
      this.setState({ loading: false });
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
      this.setState({
        loading: true,
      });
      console.log(`Searching Segments for ${search}`);
      Meteor.call('getSegmentStatsByName', search, function (err, result) {
        this.setState({
          loading: false
        });
        if(err){
          console.log('ERROR: ' + err.error);
          Bert.alert(err.error, 'danger', 'growl-top-right');
        } else {
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
    return (
      <div>
        <h4 className="white-text center-align">Who makes up your Eloqua segments?</h4>
        <h3 className="WBRed center-align">Ask Leia</h3>
        <div className="row container">
          <form className="segmentSearch white-text" onSubmit={this.handleSubmit} >
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
        <div className="container white-text">
          {this.state.loading ? <div className="progress"><div className="indeterminate"></div></div> : null}
          {this.state.stats ? <StatsPlayground {...this.state} refreshStats={this.refreshStats} /> : null}
        </div>
      </div>
    );
  }
}
