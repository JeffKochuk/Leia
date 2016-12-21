import React from 'react';
import StatsPlayground from './stats/StatsPlayground.jsx';
import { MultiSelect } from './ui/UIHelpers.jsx';

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
        const form_personas = reduceToArray(personas);
        const form_completeness = reduceToArray(completenessLevels);
        const form_industry = reduceToArray(industries);
        const form_engagement = reduceToArray(engagementStati);
        const form_theme = reduceToArray(themes);
        const form_metro = $('.metroAreaSelections').map(function(){ return $(this).attr('data')}).toArray();
        const formData = {
            email: form_email,
            personas: form_personas,
            completeness: form_completeness,
            industry: form_industry,
            engagement: form_engagement,
            metro: form_metro,
            theme: form_theme
        };
        console.log(formData);
        return formData;
    }

    handleFormSubmit() {
        const formData = this.getFormData();
        this.setState({ formData, loading: true });
        // formData has been built. Perform the query
        Meteor.call('testStatsMethod', formData, (err,res) => {
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
        this.setState({ loading: true });
        const formData = this.state.formData;
        //@TODO Name modal
        formData.name = 'Leia Created ' + new Date().valueOf();
        Meteor.call('segmentBuilderSaveToEloqua', this.state.formData, (err,res) => {
            this.setState({ loading: false });
            if (err) {
                Bert.alert(err, 'danger', 'growl-top-right');
            } else {
                Bert.alert('Created: ' + formData.name, 'info', 'growl-top-right');
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
                <div className="center-align container">
                    <h4 className="white-text center-align">Want to build your own segment?</h4>
                    <h3 className="WBRed center-align">Ask Leia</h3>
                </div>

                <div className="input-field">
                    <h5>Redhat Email Address</h5>
                    <input id="segment-email" type="email" className="validate white-text" />
                </div>

                <br />


                {/*
                <div className="input-field section">
                    <h5>Active User</h5>
                    <Checkbox id="Only Active Contacts" />
                </div>
                */}

                <TwoColumnsCheckbox options={personas} name="Persona" />

                <div className="input-field section">
                    <h5>Profile Completeness</h5>
                    <Checkbox id="High" />
                    <Checkbox id="Medium" />
                    <Checkbox id="Low" />
                </div>

                <h5>US Metro Area</h5>
                <MultiSelect options={metroAreas} />

                <TwoColumnsCheckbox options={engagementStati} name="Engagement Status" />

                <TwoColumnsCheckbox options={industries} name="Industry" />

                <TwoColumnsCheckbox options={themes} name="Theme" />

                <button className="btn large WBRedBackground waves-effect waves-light" onClick={this.handleFormSubmit}>Show Me the Segment</button>




                { this.state.stats ? <StatsPlayground {...this.state} /> : null }

                { /*this.state.stats ?  <button className="btn large WBRedBackground waves-effect waves-light" onClick={this.saveToEloqua}>Save to Eloqua</button> : null */}

                { this.state.loading ? <div className="progress"><div className="indeterminate"></div></div> : null }

                <div style={{padding: '2vh'}}>
                    &nbsp;
                </div>
            </div>
        )

    }
}

const industries = ['Agriculture','Business Services','Construction & Real Estate','Education','Energy, Raw Materials & Utilities','Finance','Government','Healthcare','Leisure & Hospitality','Libraries','Manufacturing','Media & Internet','Non-Profit & Professional Orgs.','Retail','Software','Telecommunications','Transportation'];
const personas = ['IT Manager','IT Decisionmaker','Business Analyst','System Administrator','Architect','Lead Developer'];
const engagementStati = ['Inactive', 'Internal', 'Invalid', 'Lapsed', 'Lapsing', 'Most Active'];
const completenessLevels = ['High', 'Medium', 'Low'];
const metroAreas = [ "Abilene, TX", "Aguadilla-Isabela-San Sebastian, PR MSA", "AK NONMETROPOLITAN AREA", "Akron, OH", "AL NONMETROPOLITAN AREA", "Albany, GA", "Albany-Schenectady-Troy, NY", "Albuquerque, NM", "Alexandria, LA", "Allentown-Bethlehem-Easton, PA-NJ", "Altoona, PA", "Amarillo, TX", "Ames, IA", "Anchorage, AK", "Anderson, IN MSA", "Anderson, SC MSA", "Ann Arbor, MI", "Anniston-Oxford-Jacksonville, AL", "Appleton, WI", "AR NONMETROPOLITAN AREA", "Asheville, NC", "Athens-Clarke County, GA", "Atlanta-Sandy Springs-Roswell, GA", "Atlantic City-Hammonton, NJ", "Auburn-Opelika, AL", "Augusta-Richmond County, GA-SC", "Austin-Round Rock, TX", "AZ NONMETROPOLITAN AREA", "Bakersfield, CA", "Baltimore-Columbia-Towson, MD", "Bangor, ME", "Barnstable Town, MA", "Baton Rouge, LA", "Battle Creek, MI", "Bay City, MI", "Beaumont-Port Arthur, TX", "Bellingham, WA", "Bend-Redmond, OR", "Billings, MT", "Binghamton, NY", "Birmingham-Hoover, AL", "Bismarck, ND", "Blacksburg-Christiansburg-Radford, VA", "Bloomington, IN", "Bloomington-Normal, IL MSA", "Boise City, ID", "Boston-Cambridge-Newton, MA-NH", "Boulder, CO", "Bowling Green, KY", "Bremerton-Silverdale, WA", "Bridgeport-Stamford-Norwalk, CT", "Brownsville-Harlingen, TX", "Brunswick, GA", "Buffalo-Cheektowaga-Niagara Falls, NY", "Burlington, NC", "Burlington-South Burlington, VT", "CA NONMETROPOLITAN AREA", "Canton-Massillon, OH", "Cape Coral-Fort Myers, FL", "Cape Girardeau, MO-IL", "Carson City, NV", "Casper, WY", "Cedar Rapids, IA", "Champaign-Urbana, IL", "Charleston, WV", "Charleston-North Charleston, SC", "Charlotte-Concord-Gastonia, NC-SC", "Charlottesville, VA", "Chattanooga, TN-GA", "Cheyenne, WY", "Chicago-Naperville-Elgin, IL-IN-WI", "Chico, CA", "Cincinnati, OH-KY-IN", "Clarksville, TN-KY", "Cleveland, TN", "Cleveland-Elyria, OH", "CO NONMETROPOLITAN AREA", "Coeur d'Alene, ID", "College Station-Bryan, TX", "Colorado Springs, CO", "Columbia, MO", "Columbia, SC", "Columbus, GA-AL", "Columbus, IN", "Columbus, OH", "Corpus Christi, TX", "Corvallis, OR", "CT NONMETROPOLITAN AREA", "Cumberland, MD-WV", "Dallas-Fort Worth-Arlington, TX", "Dalton, GA", "Danville, IL", "Danville, VA", "Davenport-Moline-Rock Island, IA-IL", "Dayton, OH", "DE NONMETROPOLITAN AREA", "Decatur, AL", "Decatur, IL", "Deltona-Daytona Beach-Ormond Beach, FL", "Denver-Aurora-Lakewood, CO", "Des Moines-West Des Moines, IA", "Detroit-Warren-Dearborn, MI", "Dothan, AL", "Dover, DE", "Dubuque, IA", "Duluth, MN-WI", "Durham-Chapel Hill, NC", "Eau Claire, WI", "El Centro, CA", "El Paso, TX", "Elizabethtown-Fort Knox, KY", "Elkhart-Goshen, IN", "Elmira, NY", "Erie, PA", "Eugene, OR", "Evansville, IN-KY", "Fairbanks, AK", "Fajardo, PR MSA", "Fargo, ND-MN", "Farmington, NM", "Fayetteville, NC", "Fayetteville-Springdale-Rogers, AR-MO", "FL NONMETROPOLITAN AREA", "Flagstaff, AZ", "Flint, MI", "Florence, SC", "Florence-Muscle Shoals, AL", "Fond du Lac, WI", "Fort Collins, CO", "Fort Smith, AR-OK", "Fort Walton Beach-Crestview-Destin, FL MSA", "Fort Wayne, IN", "Fresno, CA", "GA NONMETROPOLITAN AREA", "Gadsden, AL", "Gainesville, FL", "Gainesville, GA", "Glens Falls, NY", "Goldsboro, NC", "Grand Forks, ND-MN", "Grand Junction, CO", "Grand Rapids-Wyoming, MI", "Great Falls, MT", "Greeley, CO", "Green Bay, WI", "Greensboro-High Point, NC", "Greenville, NC", "Greenville-Anderson-Mauldin, SC", "Gulfport-Biloxi-Pascagoula, MS", "Hagerstown-Martinsburg, MD-WV", "Hanford-Corcoran, CA", "Harrisburg-Carlisle, PA", "Harrisonburg, VA", "Hartford-West Hartford-East Hartford, CT", "Hattiesburg, MS", "HI NONMETROPOLITAN AREA", "Hickory-Lenoir-Morganton, NC", "Hinesville, GA", "Holland-Grand Haven, MI MSA", "Honolulu, HI MSA", "Hot Springs, AR", "Houma-Thibodaux, LA", "Houston-The Woodlands-Sugar Land, TX", "Huntington-Ashland, WV-KY-OH", "Huntsville, AL", "IA NONMETROPOLITAN AREA", "ID NONMETROPOLITAN AREA", "Idaho Falls, ID", "IL NONMETROPOLITAN AREA", "IN NONMETROPOLITAN AREA", "Indianapolis-Carmel-Anderson, IN", "Iowa City, IA", "Ithaca, NY", "Jackson, MI", "Jackson, MS", "Jackson, TN", "Jacksonville, FL", "Jacksonville, NC", "Janesville-Beloit, WI", "Jefferson City, MO", "Johnson City, TN", "Johnstown, PA", "Jonesboro, AR", "Joplin, MO", "Kalamazoo-Portage, MI", "Kankakee, IL", "Kansas City, MO-KS", "Kennewick-Richland, WA", "Killeen-Temple, TX", "Kingsport-Bristol-Bristol, TN-VA", "Kingston, NY", "Knoxville, TN", "Kokomo, IN", "KS NONMETROPOLITAN AREA", "KY NONMETROPOLITAN AREA", "La Crosse-Onalaska, WI-MN", "LA NONMETROPOLITAN AREA", "Lafayette, IN MSA", "Lafayette, LA", "Lake Charles, LA", "Lake Havasu City-Kingman, AZ", "Lakeland-Winter Haven, FL", "Lancaster, PA", "Lansing-East Lansing, MI", "Laredo, TX", "Las Cruces, NM", "Las Vegas-Henderson-Paradise, NV", "Lawrence, KS", "Lawton, OK", "Lebanon, PA", "Lewiston, ID-WA", "Lewiston-Auburn, ME", "Lexington-Fayette, KY", "Lima, OH", "Lincoln, NE", "Little Rock-North Little Rock-Conway, AR", "Logan, UT-ID", "Longview, TX", "Longview, WA", "Los Angeles-Long Beach-Santa Ana, CA MSA", "Louisville/Jefferson County, KY-IN", "Lubbock, TX", "Lynchburg, VA", "MA NONMETROPOLITAN AREA", "Macon, GA", "Madera, CA", "Madison, WI", "Manchester-Nashua, NH", "Manhattan, KS", "Mankato-North Mankato, MN", "Mansfield, OH", "Mayaguez, PR MSA", "McAllen-Edinburg-Mission, TX", "MD NONMETROPOLITAN AREA", "ME NONMETROPOLITAN AREA", "Medford, OR", "Memphis, TN-MS-AR", "Merced, CA", "MI NONMETROPOLITAN AREA", "Miami-Fort Lauderdale-West Palm Beach, FL", "Michigan City-La Porte, IN", "Midland, TX", "Milwaukee-Waukesha-West Allis, WI", "Minneapolis-St. Paul-Bloomington, MN-WI", "Missoula, MT", "MN NONMETROPOLITAN AREA", "MO NONMETROPOLITAN AREA", "Mobile, AL", "Modesto, CA", "Monroe, LA", "Monroe, MI", "Montgomery, AL", "Morgantown, WV", "Morristown, TN", "Mount Vernon-Anacortes, WA", "MS NONMETROPOLITAN AREA", "MT NONMETROPOLITAN AREA", "Muncie, IN", "Muskegon, MI", "Myrtle Beach-Conway-North Myrtle Beach, SC-NC", "Napa, CA", "Naples-Immokalee-Marco Island, FL", "Nashville-Davidson--Murfreesboro--Franklin, TN", "NC NONMETROPOLITAN AREA", "ND NONMETROPOLITAN AREA", "NE NONMETROPOLITAN AREA", "New Haven-Milford, CT", "New Orleans-Metairie, LA", "New York-Newark-Jersey City, NY-NJ-PA", "NH NONMETROPOLITAN AREA", "Niles-Benton Harbor, MI", "NM NONMETROPOLITAN AREA", "Norwich-New London, CT", "NV NONMETROPOLITAN AREA", "NY NONMETROPOLITAN AREA", "Ocala, FL", "Ocean City, NJ", "Odessa, TX", "Ogden-Clearfield, UT", "OH NONMETROPOLITAN AREA", "OK NONMETROPOLITAN AREA", "Oklahoma City, OK", "Olympia-Tumwater, WA", "Omaha-Council Bluffs, NE-IA", "OR NONMETROPOLITAN AREA", "Orlando-Kissimmee-Sanford, FL", "Oshkosh-Neenah, WI", "Owensboro, KY", "Oxnard-Thousand Oaks-Ventura, CA", "PA NONMETROPOLITAN AREA", "Palm Bay-Melbourne-Titusville, FL", "Palm Coast, FL MSA", "Panama City, FL", "Parkersburg-Vienna, WV", "Pascagoula, MS MSA", "Pensacola-Ferry Pass-Brent, FL", "Peoria, IL", "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", "Phoenix-Mesa-Scottsdale, AZ", "Pine Bluff, AR", "Pittsburgh, PA", "Pittsfield, MA", "Pocatello, ID", "Ponce, PR MSA", "Port St. Lucie, FL", "Portland-South Portland, ME", "Portland-Vancouver-Hillsboro, OR-WA", "Poughkeepsie-Newburgh-Middletown, NY MSA", "PR NONMETROPOLITAN AREA", "Prescott, AZ", "Providence-Warwick, RI-MA", "Provo-Orem, UT", "Pueblo, CO", "Punta Gorda, FL", "Racine, WI", "Raleigh, NC", "Rapid City, SD", "Reading, PA", "Redding, CA", "Reno, NV", "Richmond, VA", "Riverside-San Bernardino-Ontario, CA", "Roanoke, VA", "Rochester, MN", "Rochester, NY", "Rockford, IL", "Rocky Mount, NC", "Rome, GA", "Sacramento--Roseville--Arden-Arcade, CA", "Saginaw, MI", "Salem, OR", "Salinas, CA", "Salisbury, MD-DE", "Salt Lake City, UT", "San Angelo, TX", "San Antonio-New Braunfels, TX", "San Diego-Carlsbad, CA", "San Francisco-Oakland-Hayward, CA", "San German-Cabo Rojo, PR MSA", "San Jose-Sunnyvale-Santa Clara, CA", "San Juan-Caguas-Guaynabo, PR MSA", "San Luis Obispo-Paso Robles-Arroyo Grande, CA", "Sandusky, OH", "Santa Barbara-Santa Maria-Goleta, CA MSA", "Santa Cruz-Watsonville, CA", "Santa Fe, NM", "Santa Rosa, CA", "Sarasota-Bradenton-Venice, FL MSA", "Savannah, GA", "SC NONMETROPOLITAN AREA", "Scranton--Wilkes-Barre--Hazleton, PA", "SD NONMETROPOLITAN AREA", "Seattle-Tacoma-Bellevue, WA", "Sebastian-Vero Beach, FL", "Sheboygan, WI", "Sherman-Denison, TX", "Shreveport-Bossier City, LA", "Sioux City, IA-NE-SD", "Sioux Falls, SD", "South Bend-Mishawaka, IN-MI", "Spartanburg, SC", "Spokane-Spokane Valley, WA", "Springfield, IL", "Springfield, MA", "Springfield, MO", "Springfield, OH", "St. Cloud, MN", "St. George, UT", "St. Joseph, MO-KS", "St. Louis, MO-IL", "State College, PA", "Stockton-Lodi, CA", "Sumter, SC", "Syracuse, NY", "Tallahassee, FL", "Tampa-St. Petersburg-Clearwater, FL", "Terre Haute, IN", "Texarkana, TX-AR", "TN NONMETROPOLITAN AREA", "Toledo, OH", "Topeka, KS", "Trenton, NJ", "Tucson, AZ", "Tulsa, OK", "Tuscaloosa, AL", "TX NONMETROPOLITAN AREA", "Tyler, TX", "UT NONMETROPOLITAN AREA", "Utica-Rome, NY", "VA NONMETROPOLITAN AREA", "Valdosta, GA", "Vallejo-Fairfield, CA", "Victoria, TX", "Vineland-Bridgeton, NJ", "Virginia Beach-Norfolk-Newport News, VA-NC", "Visalia-Porterville, CA", "VT NONMETROPOLITAN AREA", "WA NONMETROPOLITAN AREA", "Waco, TX", "Warner Robins, GA", "Washington-Arlington-Alexandria, DC-VA-MD-WV", "Waterloo-Cedar Falls, IA", "Wausau, WI", "Weirton-Steubenville, WV-OH", "Wenatchee, WA", "Wheeling, WV-OH", "WI NONMETROPOLITAN AREA", "Wichita Falls, TX", "Wichita, KS", "Williamsport, PA", "Wilmington, NC", "Winchester, VA-WV", "Winston-Salem, NC", "Worcester, MA-CT", "WV NONMETROPOLITAN AREA", "WY NONMETROPOLITAN AREA", "Yakima, WA", "Yauco, PR MSA", "York-Hanover, PA", "Youngstown-Warren-Boardman, OH-PA", "Yuba City, CA", "Yuma, AZ" ];
const themes = ['DemandGen', 'Website','Accelerate','Accelerate App Development','LeadGen','Standardize','Awareness','Efficiency','Modernize'];
//Make a checkbox with functional onClick handlers
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

