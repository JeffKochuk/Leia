import React, { PropTypes, Component } from 'react';
import ContactList from './ContactList.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';
import { Bert } from 'meteor/themeteorchef:bert';

export default class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [],
      name: '',
    };
    Session.set({ 
      loading: false,
    });
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleKey = this.handleKey.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const search = document.getElementById('segment-name-input').value.trim();
    if(search){
      Session.set({
        loading: true,
      });
      console.log(`Searching Segments for ${search}`);
      Meteor.call('getContactsOfSegmentByName', search, function (err, result) {
        Session.set({
          loading: false
        });
        if(err){
          console.log('ERROR: ' + err.error);
          Bert.alert(err.error, 'danger', 'growl-top-right');
        } else if (result.length) {
          console.log(result);
          console.log(search);
          this.setState({
            data: result,
            name: search
          });
        } else {
          console.log('Got empty result!');
          this.setState({
            data: [],
            name: search
          })
        }
      }.bind(this));
    }
  }
  handleKey(event){
    if(event.key == 'Enter'){
      this.handleSubmit(event);
    }
  }

  render() {
    return (
      <div>
        <h4 className="white-text center-align">Who makes up your Eloqua segments?</h4>
        <h3 className="WBRed center-align"> Ask Leia</h3>
        <div className="row">
          <form className="segmentSearch white-text container" onSubmit={this.handleSubmit} >
            <div className="input-field col s8">
              <input
              id="segment-name-input"
              type="text"
              ref="textInput"
              placeholder="Enter Segment Name"
              className="white-text"
              onKeyPress={this.handleKey}
              />
            </div>
            <div className="input-field col s1">
              <a
                onClick={this.handleSubmit}
                className="btn-floating WBRedBackground waves-effect waves-light white-text"
              ><i className="material-icons">search</i></a>
            </div>
          </form>
          <div className="input-field col s3">
            <p className="white-text"> Contacts: {this.state.data.length && this.state.name ? `${this.state.data.length}` : ' - -'}</p>
          </div>
        </div>
        <ContactList data={this.state.data} name={this.state.name} />
      </div>
    );
  }
}
