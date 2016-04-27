import React, { PropTypes, Component } from 'react';
import ContactList from './ContactList.jsx';
import LoadingBar from './LoadingBar.jsx';
import { createContainer } from 'meteor/react-meteor-data';
import { Meteor } from 'meteor/meteor';
import { Session } from 'meteor/session';

export default class App extends Component {
  constructor(props) {
    super(props);
    const defaultSegment = { _id: '0', name: 'NoSegmentHasBeenSearchYet' }
    this.state = {
      defaultSegment,
      message: 'Search for a segment...',
    };
    Session.set({
      segment: this.state.defaultSegment,
      loading: false,
    });
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    event.preventDefault();
    const search = event.target[0].value.trim();
    // @todo Validate Search Here
    // @todo Possibly add a loading badge here which is cleared on success
    Session.set({
      segment: this.state.defaultSegment,
      loading: true,
    });
    console.log(`Searching Segments for ${search}`)
    Meteor.call('getSegmentByName', search, function (err, result) {
      if (result) {
        console.log(`Got a result ${result}`);
        Session.set('segment', result);
        this.setState({ message: null });
      } else {
        console.log('Segment could not be found');
        Session.set({
          segment: this.state.defaultSegment,
          loading: false,
        });
        this.setState({ message: `Segment '${search}' could not be found.` });
      }
    }.bind(this));
  }

  render() {
    return (
      <div className="container">
        <header>
          <h6 className="white-text right-align">Menu</h6>
        </header>
        <h2 className="white-text center-align regular">Who makes up your Eloqua segments?</h2>
        <h3 className="red-text text-darken-2 thin center-align"> Ask Inara </h3>
        <form className="segmentSearch white-text" onSubmit={this.handleSubmit} >
          <input
            type="text"
            ref="textInput"
            placeholder="Segment Name"
            className="white-text"
          />
          <input type="submit" className="btn waves-effect wave-light red darken-2 white-text" />
        </form>
        <br />
        <p className="white-text bold">{this.state.message}</p>
        <ContactList params={{ segment: Session.get('segment') }} />
      </div>
    );
  }
}
