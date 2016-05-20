import React from 'react';

export default class Search extends React.Component {
  constructor(){
    super();
    this.searchElements = [
      {text: 'Sherlock - Find Contacts by Shared List', link: 'https://sherlock-marketing.itos.redhat.com/sharedlist'},
      {text: 'Sherlock - Investigate an Eloqua contact', link: 'https://sherlock-marketing.itos.redhat.com/email'},
      {text: 'Sherlock - Decode Path Codes', link: 'https://sherlock-marketing.itos.redhat.com/codes'},
      {text: 'Columbo - Filter a List of Contacts through Eloqua', link: 'https://columbo-marketing.itos.redhat.com'},
      {text: 'Workflows - You Can\'t Comprehend TRUE BEAUTY until You\'ve Used Workflows', link: 'https://labs-marketing.itos.redhat.com/workflows.html'}
    ];
    this.state = { results: [] };
    this.handleChange = this.handleChange.bind(this);
    this.returnResults = this.returnResults.bind(this);
  }

  componentDidMount(){
    $("#searchDropdown").dropdown({
      inDuration: 30,
      outDuration: 20,
      hover: true, // Activate on hover
      belowOrigin: true, // Displays dropdown below the button
      alignment: 'left', // Displays dropdown with edge aligned to the left of button
      gutter: 100
    });
  }

  handleChange(){
    let searchVal = $('#headerSearch')[0].value;
    if(searchVal){
      let regex = new RegExp(searchVal, 'i');
      results = this.searchElements.filter((element) => regex.test(element.text));
      this.setState({ results });
    } else {
      this.setState({ results: [] });
    }
    //jquery dropdown initialization
    this.forceUpdate();
  }

  mapResults(element, index){
    return(
      <li key={index}><a href={element.link} className="collection-item">{element.text}</a></li>
    )
  }

  //onBlur deactivate. Emit event 'close'
  closeDropdown(){
    $('#searchDropdownButton').trigger('close');
  }

  //onFocus activate. Emit event 'open'
  openDropdown(){
    $('#searchDropdownButton').trigger('open');
  }

  returnResults(){
    return (
      <ul id='searchDropdown' className='dropdown-content'>
        { this.state.results.map(this.mapResults)}
      </ul>
    );
  }

  render(){
    return(
      <div className="input-field">
        <i className="material-icons prefix white-text" >search</i>
        <input id="headerSearch"
               className="headerSearch"
               placeholder="Search Workbench..."
               type="search"
               onChange={this.handleChange}
               onFocus={this.openDropdown}
               onBlur={this.closeDropdown}
        />
        <a id="searchDropdownButton"
           className="dropdown-button"
           href='#'
           data-activates='searchDropdown'
           data-constrainwidth="false"
           data-alignment="right"
           data-belowOrigin="false"
           data-gutter="45"
        > </a>
        {this.state.results ? this.returnResults() : null}
      </div>
    );
  }
}