import React from 'react';
import StatsPlayground from './stats/StatsPlayground.jsx';

export default class SegmentBuilderApp extends React.Component {
    constructor() {
        super();
        this.state = {};

        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.getFormData = this.getFormData.bind(this);
        this.saveToEloqua = this.saveToEloqua.bind(this);
    }

    getFormData() {
        const reduceToArray = (arr) => arr.reduce((all, next) => {
            if (document.getElementById(next).checked) {
                all.push(next);
            }
            return all;
        },[]);
        console.log('FORM SUBMIT');
        const form_email = document.getElementById('segment-email').value.trim();
        const form_areasOfInterest = reduceToArray(areasOfInterest);
        // const form_interestSource = reduceToArray(interestSources);
        const form_activeUsers = document.getElementById('Only Active Contacts').checked && true; //set undefined to false
        const form_personas = reduceToArray(personas);
        const form_completeness = document.getElementById('Complete Profiles').checked && true; //set undefined to false
        // const form_geography = document.getElementById('zip-code').value;
        // const form_geography_radius = document.getElementById('geography-radius').value;
        const form_industry = reduceToArray(industries);

        return {
            email: form_email,
            areasOfInterest: form_areasOfInterest,
            // interestSource: form_interestSource,
            activeUsers: form_activeUsers,
            personas: form_personas,
            completeness: form_completeness,
            // geography: form_geography,
            // geographyRadius: form_geography_radius,
            industry: form_industry
        };
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        this.setState({ formData, loading: true });
        // formData has been built. Perform the query
        Meteor.call('segmentBuilderBuildOriginalStats', formData, (err,res) => {
            this.setState({ loading: false });
            if (err) {
                Bert.alert(err, 'danger', 'growl-top-right');
            } else {
                this.setState(res);
            }
        });
    }

    //Create the segment in Eloqua
    saveToEloqua() {
        console.log("Save to Eloqua");
        this.setState({ saving: true });
        Meteor.call('saveToEloqua', this.state.formData, (err,res) => {
            this.setState({ saving: false });
            if (err) {
                Bert.alert(err, 'danger', 'growl-top-right');
            } else {
                this.setState(res);
            }
        })
    }

    componentDidMount() {
        $('select').material_select();
    }

    render() {
        return (
            <div id="segment-builder-form" className="container white-text text-darken-1">
                <header className="center-align container">
                    <h1 className="WBRed">Segment Builder</h1>
                    <p className="white-text">Hashtag stumptown skateboard pinterest trust fund. Mlkshk 90's thundercats synth, +1 polaroid farm-to-
                        table selvage bicycle rights 8-bit quinoa. Tousled banjo four loko salvia. IPhone echo park jean shorts
                        distillery, post-ironic austin 8-bit tofu occupy.</p>
                </header>

                <div className="input-field col m8">
                    <h5>Redhat Email Address</h5>
                    <input id="segment-email" type="email" className="validate white-text" />
                </div>

                <br />

                <TwoColumnsCheckbox options={areasOfInterest} name="Area of Interest" />

                {/* Interest Source is not currently functional
                <div className="input-field section">
                    <h5>Interest Source - ?</h5>
                    {interestSources.map((interest,  idx) => <Checkbox id={interest} key={idx} />)}
                </div>
                */}

                {/* Use this section if you need to add a blurb
                <section className="center-align container">
                    <h3 className="WBRed">Criteria</h3>
                    <p style={{color: '#EEE'}}>Jolly good show holiday waiter mark style holiday waiter doctor watson. holiday waiter what a bounder beefeater success groucho-a-like Nostrilis tickler crumb catcher rugged mark lawrenson villain middle eastern despot prince barin jolly good show leslie phillips sam elliott. Felis worn with distinction old west sheriff dick van dyke hold steady keyboardist prostate cancer lorreto del mar?</p>
                </section>
                */}

                {/*
                <div className="input-field section">
                    <h5>Active User</h5>
                    <Checkbox id="Only Active Contacts" />
                </div>
                */}

                <TwoColumnsCheckbox options={personas} name="Persona / Job Level" />

                <div className="input-field section">
                    <h5>Profile Completeness / Data Quality</h5>
                    <Checkbox id="Complete Profiles" />
                </div>

                {/* Geography is not currently implemented
                <div className="input-field section row">
                    <h5>Geography</h5>
                    <div className="col s3">
                        <input type="text" maxlength="10" minlength="5" placeholder="Zip Code" id="zip-code" />
                    </div>
                    <div className="col s3">
                        <select type="text" maxlength="10" minlength="5" id="geography-radius">
                            <option value="unselected">-- Radius --</option>
                            <option value="23">23 Feet</option>
                            <option value="100">100 Miles</option>
                            <option value="1000">1000 Miles</option>
                            <option value="10000">10000 Miles</option>
                        </select>
                    </div>
                </div>
                */}

                <TwoColumnsCheckbox options={industries} name="Industry" />

                <button className="btn large WBRedBackground waves-effect waves-light" onClick={this.handleFormSubmit}>Show Me the Segment</button>

                {this.state.stats ? <StatsPlayground {...this.state} /> : null}

                {this.state.stats ?  <button className="btn large WBRedBackground waves-effect waves-light" onClick={this.saveToEloqua}>Save to Eloqua</button> : null}

            </div>
        )

    }
}

const industries = ['Transportation','Telecommunications','Financial','Government','Healthcare','Retail'];
const areasOfInterest = ["Developer Productivity Tools", "Cloud Computing", "Consulting", "Cloud", "Business Rules", "BPM / BRMS", "Data Integration and Management", "Development Tools", "CloudForms", "Ansible", "Containers", "Gluster Storage", "Global Professional Services", "General Product & Services Overview"  ];
const interestSources = ["Companies visiting redhat.com", "Companies downloading content from syndication networks (e.g., Bombora)", "Companies matching Red Hat's ideal customer profile (e.g., Mintigo)", "Companies provided by Sales and/or Marketing"];
const personas = ['IT Manager','IT Decisionmaker','Business Analyst','System Administrator','Architect','Lead Developer',]
const Checkbox = ({ id }) => (<p onClick={(e) => {const el = document.getElementById(id); el.checked = !el.checked; el.setAttribute("checked", el.checked ? "checked" : "");}}><input type="checkbox" id={id} /> <label for={id}>{id}</label></p>)
// Given a list of options, maps each option to a Checkbox and splits them into two columns.
const TwoColumnsCheckbox = ({ options, name }) => (
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