/**
 * Created by jkochuk on 11/1/16.
 */
import React from 'react';

//Properties = options: Str[]
export class MultiSelect extends React.Component {
    constructor() {
        super();
        this.state = {
            selected: {},
            results: [],
            search: ''
        };
        this.handleListItemClick = this.handleListItemClick.bind(this);
        this.mapResults = this.mapResults.bind(this);
        this.returnResults = this.returnResults.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.openDropdown = this.openDropdown.bind(this);
        this.closeDropdown = this.closeDropdown.bind(this);
    }

    componentDidMount() {
        $("#metroSearchDropdown").dropdown({
            inDuration: 30,
            outDuration: 20,
            hover: true, // Activate on hover
            belowOrigin: true, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            gutter: 100
        });
    }

    handleListItemClick(e) {
        console.log('E', e);
        const clickedValue = e.target.getAttribute('data');
        console.log(clickedValue);
        const val = {};
        val[clickedValue] = true;
        this.setState(Object.assign(this.state.selected, val));
        document.getElementById('metroAreaSearch').value = '';
        this.handleChange();
        e.preventDefault();
    }

    mapResults(element, index) {
        return (
            <li key={index} onClick={this.handleListItemClick} data={element}><a href='#' className="collection-item" data={element}>{element}</a>
            </li>
        )
    }



    handleChange() {
        const searchVal = document.getElementById('metroAreaSearch').value.trim();
        console.log(searchVal);
        if (searchVal) {
            const regex = new RegExp(searchVal, 'i');
            const results = this.props.options.filter((element) => regex.test(element) && this.state.selected[element] !== true).slice(0,8);
            console.log(results);
            this.setState({ results });
        } else {
            this.setState({ results: [] });
        }
        //jquery dropdown initialization
        this.forceUpdate();
    }

    //onBlur deactivate. Emit event 'close'
    closeDropdown() {
        $('#metroAreaDropdownButton').trigger('close');
    }

    //onFocus activate. Emit event 'open'
    openDropdown() {
        $('#metroAreaDropdownButton').trigger('open');
    }

    returnResults() {
        console.log('returning results');
        return (
            <ul id='metroSearchDropdown' className='dropdown-content'>
                { this.state.results.map(this.mapResults)}
            </ul>
        );
    }

    render() {
        return (
            <div className="row">
                <div className="input-field col s6" style={{display:'flex', flexDirection:'column'}}>
                    <input id="metroAreaSearch"
                           placeholder="US Metro Area"
                           type="text"
                           onChange={this.handleChange}
                           onFocus={this.openDropdown}
                           onBlur={this.closeDropdown}
                           style={{margin:'0 0 1px 0'}}
                    />
                    <a id="metroAreaDropdownButton"
                       className="dropdown-button"
                       href='#'
                       data-activates='metroSearchDropdown'
                       data-constrainwidth="false"
                       data-alignment="left"
                       data-belowOrigin="true"
                       data-gutter="100px"
                    > </a>
                    {this.state.results ? this.returnResults() : null}
                </div>
                <div className="col s6">
                    <ul>
                        {Object.keys(this.state.selected).filter((v) => this.state.selected[v]).map((name, idx) => <li key={idx} style={{cursor:'pointer'}}  data={name} className="metroAreaSelections" onClick={function(){val={}; val[name]=false; this.setState(Object.assign(this.state.selected, val))}.bind(this)}>{name}</li>)}
                    </ul>
                </div>
            </div>
        )
    }
}

//Make a checkbox with functional onClick handlers
export const Checkbox = ({ id }) =>
    (<p onClick={
        (e) => {
            const el = document.getElementById(id);
            el.checked = !el.checked;
            el.setAttribute("checked", el.checked ? "checked" : "");
        }
    }>
        <input type="checkbox" id={id} /> <label for={id}>{id}</label></p>
    );

// Given a list of options, maps each option to a Checkbox and splits them into two columns.
export const TwoColumnsCheckbox = ({ options, name }) => (
    <div className="input-field section row">
        <h5>{name}</h5>
        <div className="col m6">
            {options.slice(0,Math.ceil(options.length / 2)).map((interest,  idx) => <Checkbox id={interest} key={idx} />)}
        </div>
        <div className="col m6">
            { options.slice(Math.ceil(options.length / 2)).map((interest,  idx) => <Checkbox id={interest} key={idx} />) }
        </div>
    </div>
);
