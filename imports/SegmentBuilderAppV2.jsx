import React from 'react';
import StatsPlayground from './stats/StatsPlayground.jsx';
import {  Checkbox, TwoColumnsCheckbox } from './ui/UIHelpers.jsx';
import { Meteor } from 'meteor/meteor';
import { Bert } from 'meteor/themeteorchef:bert';

export default class SegmentBuilderApp extends React.Component {
    constructor() {
        super();
        this.state = {
            filters: {}, // Array of { field: (string), vals: [(string)]
            stats: {},
            fullStats: undefined,
            loading: false,
            active: 'Themes'
        };
        this.toggleFilter = this.toggleFilter.bind(this);
        this.getNewStats = this.getNewStats.bind(this);
        this.toggleActive = this.toggleActive.bind(this);
        this.saveToEloqua = this.saveToEloqua.bind(this);
        this.getReport = this.getReport.bind(this);
    }

    getReport() {
        console.log('Generating Report');
        Meteor.call('getFullStats', this.state.filters, (err, res) => {
            this.setState({ loading: false });
            if (err) {
                console.log('Error:', err);
            } else {
                console.log(res);
                this.setState(res);
            }
        });
        this.setState({ loading: true });
        Bert.alert('Generating Segment Report', 'info', 'growl-top-right');
    }

    saveToEloqua() {
        console.log(this.state.filters);
        Bert.alert('Eloqua Saving not currently implemented', 'danger', 'growl-top-right');
    }

    // Only one filter criteria should be visible at a time
    toggleActive(name) {
        if (this.state.active === name) {
            this.setState({ active: null })
        } else {
            this.setState({ active: name });
        }
    }

    // add or remove { [field]: val } to this.state.filters
    // Then call to getNewStats
    toggleFilter(field, val) {
        const fieldHolder = this.state.filters[field] || [];
        let newFieldHolder;
        if (fieldHolder.includes(val)) { // If this is already in our state, remove it
            console.log('removed', val, 'from', field);
            newFieldHolder = fieldHolder.filter(e => e !== val)
        } else {
            console.log('added', val, 'to', field);
            newFieldHolder = fieldHolder.concat([val])
        }
        const newFilters = Object.assign({}, this.state.filters, { [field]: newFieldHolder });
        this.setState({ filters: newFilters }, this.getNewStats)
    }

    // Don't update stats when selecting Company or Country
    //@TODO Company and Country are Not actually implemented yet. Look at SparseStats in segmentBuilderMethods
    toggleFilterWithoutUpdatingStats(field, val) {
        const fieldHolder = this.state.filters[field] || [];
        let newFieldHolder;
        if (fieldHolder.includes(val)) { // If this is already in our state, remove it
            console.log('removed', val, 'from', field);
            newFieldHolder = fieldHolder.filter(e => e !== val)
        } else {
            console.log('added', val, 'to', field);
            newFieldHolder = fieldHolder.concat([val])
        }
        const newFilters = Object.assign({}, this.state.filters, { [field]: newFieldHolder });
        this.setState({ filters: newFilters })
    }

    // Get new stats
    getNewStats() {
        console.log('Getting new stats!');
        this.setState({ loading: true });
        Meteor.call('getQuickStats', this.state.filters, (err, res) => {
            this.setState({ loading: false });
            if (err) {
                console.log('Error:', err);
            } else {
                console.log(res);
                this.setState(res);
            }
        });
        console.log('GettingSparseStatsToo');
        Meteor.call('getSparseStats', this.state.filters, (err, res) => {
            console.log(res);
            this.setState({ loading: false });
            if (err) {
                console.log('Error:', err);
            } else {
                console.log(res);
                this.setState(res);
            }
        })

    }

    render() {
        return (
            <div>
                <div id="segment-builder-form" className="container white-text text-darken-1 row">
                    <div className="center-align container col s12">
                        <h4 className="white-text center-align">Want to build your own segment?</h4>
                        <h3 className="WBRed center-align">Ask Leia</h3>
                    </div>


                    <div className="col s8">
                        {/* ... THEME + Things to Filter By */}
                        <ChooseFilterOptions filterOptionsArray={THINGS_TO_FILTER_BY} clickFunc={this.toggleFilter} activateFunc={this.toggleActive} active={this.state.active} selectedFilters={this.state.filters} stats={this.state.stats}/>
                        {
                            /* If stats includes values for Country and Company, render these as well */
                            this.state.sparseStats ?
                                Object.keys(this.state.sparseStats)
                                .filter(name=>this.state.sparseStats[name])
                                .map(name => (<ChooseFilterOptions key={name} filterOptionsArray={ [ { name, options: Object.keys(this.state.sparseStats[name]) } ] } clickFunc={this.toggleFilter} activateFunc={this.toggleActive} active={this.state.active} selectedFilters={this.state.filters} stats={this.state.sparseStats} />))
                                : null
                        }
                    </div>

                    <div className="col s4">
                        <h4>Things</h4>
                        { this.state.stats && this.state.stats.count ? (<p>{`Count: ${this.state.stats.count}`}</p>) : null}
                        <SelectedOptions filters={this.state.filters} onSelect={this.toggleFilter} />
                        <div className="row">
                            <button className='WBRedBackground btn waves-effect waves-light white-text' onClick={this.getReport}>Segment Report Card</button>
                        </div>
                        <div className="row">
                            <button className='WBRedBackground btn waves-effect waves-light white-text' onClick={this.saveToEloqua}>SaveToEloqua</button>
                        </div>
                    </div>

                </div>
                <div className="container white-text">
                    { this.state.fullStats ? (<StatsPlayground stats={this.state.fullStats} total={this.state.fullStats.total} refreshStats={this.getReport} />) : null }
                </div>
            </div>
        );

    }
}

const engagementStati = ['Inactive', 'Internal', 'Invalid', 'Lapsed', 'Lapsing', 'Most Active'];
const completenessLevels = ['High', 'Medium', 'Low'];
const USMetroAreas = [ "Abilene, TX", "Aguadilla-Isabela-San Sebastian, PR MSA", "AK NONMETROPOLITAN AREA", "Akron, OH", "AL NONMETROPOLITAN AREA", "Albany, GA", "Albany-Schenectady-Troy, NY", "Albuquerque, NM", "Alexandria, LA", "Allentown-Bethlehem-Easton, PA-NJ", "Altoona, PA", "Amarillo, TX", "Ames, IA", "Anchorage, AK", "Anderson, IN MSA", "Anderson, SC MSA", "Ann Arbor, MI", "Anniston-Oxford-Jacksonville, AL", "Appleton, WI", "AR NONMETROPOLITAN AREA", "Asheville, NC", "Athens-Clarke County, GA", "Atlanta-Sandy Springs-Roswell, GA", "Atlantic City-Hammonton, NJ", "Auburn-Opelika, AL", "Augusta-Richmond County, GA-SC", "Austin-Round Rock, TX", "AZ NONMETROPOLITAN AREA", "Bakersfield, CA", "Baltimore-Columbia-Towson, MD", "Bangor, ME", "Barnstable Town, MA", "Baton Rouge, LA", "Battle Creek, MI", "Bay City, MI", "Beaumont-Port Arthur, TX", "Bellingham, WA", "Bend-Redmond, OR", "Billings, MT", "Binghamton, NY", "Birmingham-Hoover, AL", "Bismarck, ND", "Blacksburg-Christiansburg-Radford, VA", "Bloomington, IN", "Bloomington-Normal, IL MSA", "Boise City, ID", "Boston-Cambridge-Newton, MA-NH", "Boulder, CO", "Bowling Green, KY", "Bremerton-Silverdale, WA", "Bridgeport-Stamford-Norwalk, CT", "Brownsville-Harlingen, TX", "Brunswick, GA", "Buffalo-Cheektowaga-Niagara Falls, NY", "Burlington, NC", "Burlington-South Burlington, VT", "CA NONMETROPOLITAN AREA", "Canton-Massillon, OH", "Cape Coral-Fort Myers, FL", "Cape Girardeau, MO-IL", "Carson City, NV", "Casper, WY", "Cedar Rapids, IA", "Champaign-Urbana, IL", "Charleston, WV", "Charleston-North Charleston, SC", "Charlotte-Concord-Gastonia, NC-SC", "Charlottesville, VA", "Chattanooga, TN-GA", "Cheyenne, WY", "Chicago-Naperville-Elgin, IL-IN-WI", "Chico, CA", "Cincinnati, OH-KY-IN", "Clarksville, TN-KY", "Cleveland, TN", "Cleveland-Elyria, OH", "CO NONMETROPOLITAN AREA", "Coeur d'Alene, ID", "College Station-Bryan, TX", "Colorado Springs, CO", "Columbia, MO", "Columbia, SC", "Columbus, GA-AL", "Columbus, IN", "Columbus, OH", "Corpus Christi, TX", "Corvallis, OR", "CT NONMETROPOLITAN AREA", "Cumberland, MD-WV", "Dallas-Fort Worth-Arlington, TX", "Dalton, GA", "Danville, IL", "Danville, VA", "Davenport-Moline-Rock Island, IA-IL", "Dayton, OH", "DE NONMETROPOLITAN AREA", "Decatur, AL", "Decatur, IL", "Deltona-Daytona Beach-Ormond Beach, FL", "Denver-Aurora-Lakewood, CO", "Des Moines-West Des Moines, IA", "Detroit-Warren-Dearborn, MI", "Dothan, AL", "Dover, DE", "Dubuque, IA", "Duluth, MN-WI", "Durham-Chapel Hill, NC", "Eau Claire, WI", "El Centro, CA", "El Paso, TX", "Elizabethtown-Fort Knox, KY", "Elkhart-Goshen, IN", "Elmira, NY", "Erie, PA", "Eugene, OR", "Evansville, IN-KY", "Fairbanks, AK", "Fajardo, PR MSA", "Fargo, ND-MN", "Farmington, NM", "Fayetteville, NC", "Fayetteville-Springdale-Rogers, AR-MO", "FL NONMETROPOLITAN AREA", "Flagstaff, AZ", "Flint, MI", "Florence, SC", "Florence-Muscle Shoals, AL", "Fond du Lac, WI", "Fort Collins, CO", "Fort Smith, AR-OK", "Fort Walton Beach-Crestview-Destin, FL MSA", "Fort Wayne, IN", "Fresno, CA", "GA NONMETROPOLITAN AREA", "Gadsden, AL", "Gainesville, FL", "Gainesville, GA", "Glens Falls, NY", "Goldsboro, NC", "Grand Forks, ND-MN", "Grand Junction, CO", "Grand Rapids-Wyoming, MI", "Great Falls, MT", "Greeley, CO", "Green Bay, WI", "Greensboro-High Point, NC", "Greenville, NC", "Greenville-Anderson-Mauldin, SC", "Gulfport-Biloxi-Pascagoula, MS", "Hagerstown-Martinsburg, MD-WV", "Hanford-Corcoran, CA", "Harrisburg-Carlisle, PA", "Harrisonburg, VA", "Hartford-West Hartford-East Hartford, CT", "Hattiesburg, MS", "HI NONMETROPOLITAN AREA", "Hickory-Lenoir-Morganton, NC", "Hinesville, GA", "Holland-Grand Haven, MI MSA", "Honolulu, HI MSA", "Hot Springs, AR", "Houma-Thibodaux, LA", "Houston-The Woodlands-Sugar Land, TX", "Huntington-Ashland, WV-KY-OH", "Huntsville, AL", "IA NONMETROPOLITAN AREA", "ID NONMETROPOLITAN AREA", "Idaho Falls, ID", "IL NONMETROPOLITAN AREA", "IN NONMETROPOLITAN AREA", "Indianapolis-Carmel-Anderson, IN", "Iowa City, IA", "Ithaca, NY", "Jackson, MI", "Jackson, MS", "Jackson, TN", "Jacksonville, FL", "Jacksonville, NC", "Janesville-Beloit, WI", "Jefferson City, MO", "Johnson City, TN", "Johnstown, PA", "Jonesboro, AR", "Joplin, MO", "Kalamazoo-Portage, MI", "Kankakee, IL", "Kansas City, MO-KS", "Kennewick-Richland, WA", "Killeen-Temple, TX", "Kingsport-Bristol-Bristol, TN-VA", "Kingston, NY", "Knoxville, TN", "Kokomo, IN", "KS NONMETROPOLITAN AREA", "KY NONMETROPOLITAN AREA", "La Crosse-Onalaska, WI-MN", "LA NONMETROPOLITAN AREA", "Lafayette, IN MSA", "Lafayette, LA", "Lake Charles, LA", "Lake Havasu City-Kingman, AZ", "Lakeland-Winter Haven, FL", "Lancaster, PA", "Lansing-East Lansing, MI", "Laredo, TX", "Las Cruces, NM", "Las Vegas-Henderson-Paradise, NV", "Lawrence, KS", "Lawton, OK", "Lebanon, PA", "Lewiston, ID-WA", "Lewiston-Auburn, ME", "Lexington-Fayette, KY", "Lima, OH", "Lincoln, NE", "Little Rock-North Little Rock-Conway, AR", "Logan, UT-ID", "Longview, TX", "Longview, WA", "Los Angeles-Long Beach-Santa Ana, CA MSA", "Louisville/Jefferson County, KY-IN", "Lubbock, TX", "Lynchburg, VA", "MA NONMETROPOLITAN AREA", "Macon, GA", "Madera, CA", "Madison, WI", "Manchester-Nashua, NH", "Manhattan, KS", "Mankato-North Mankato, MN", "Mansfield, OH", "Mayaguez, PR MSA", "McAllen-Edinburg-Mission, TX", "MD NONMETROPOLITAN AREA", "ME NONMETROPOLITAN AREA", "Medford, OR", "Memphis, TN-MS-AR", "Merced, CA", "MI NONMETROPOLITAN AREA", "Miami-Fort Lauderdale-West Palm Beach, FL", "Michigan City-La Porte, IN", "Midland, TX", "Milwaukee-Waukesha-West Allis, WI", "Minneapolis-St. Paul-Bloomington, MN-WI", "Missoula, MT", "MN NONMETROPOLITAN AREA", "MO NONMETROPOLITAN AREA", "Mobile, AL", "Modesto, CA", "Monroe, LA", "Monroe, MI", "Montgomery, AL", "Morgantown, WV", "Morristown, TN", "Mount Vernon-Anacortes, WA", "MS NONMETROPOLITAN AREA", "MT NONMETROPOLITAN AREA", "Muncie, IN", "Muskegon, MI", "Myrtle Beach-Conway-North Myrtle Beach, SC-NC", "Napa, CA", "Naples-Immokalee-Marco Island, FL", "Nashville-Davidson--Murfreesboro--Franklin, TN", "NC NONMETROPOLITAN AREA", "ND NONMETROPOLITAN AREA", "NE NONMETROPOLITAN AREA", "New Haven-Milford, CT", "New Orleans-Metairie, LA", "New York-Newark-Jersey City, NY-NJ-PA", "NH NONMETROPOLITAN AREA", "Niles-Benton Harbor, MI", "NM NONMETROPOLITAN AREA", "Norwich-New London, CT", "NV NONMETROPOLITAN AREA", "NY NONMETROPOLITAN AREA", "Ocala, FL", "Ocean City, NJ", "Odessa, TX", "Ogden-Clearfield, UT", "OH NONMETROPOLITAN AREA", "OK NONMETROPOLITAN AREA", "Oklahoma City, OK", "Olympia-Tumwater, WA", "Omaha-Council Bluffs, NE-IA", "OR NONMETROPOLITAN AREA", "Orlando-Kissimmee-Sanford, FL", "Oshkosh-Neenah, WI", "Owensboro, KY", "Oxnard-Thousand Oaks-Ventura, CA", "PA NONMETROPOLITAN AREA", "Palm Bay-Melbourne-Titusville, FL", "Palm Coast, FL MSA", "Panama City, FL", "Parkersburg-Vienna, WV", "Pascagoula, MS MSA", "Pensacola-Ferry Pass-Brent, FL", "Peoria, IL", "Philadelphia-Camden-Wilmington, PA-NJ-DE-MD", "Phoenix-Mesa-Scottsdale, AZ", "Pine Bluff, AR", "Pittsburgh, PA", "Pittsfield, MA", "Pocatello, ID", "Ponce, PR MSA", "Port St. Lucie, FL", "Portland-South Portland, ME", "Portland-Vancouver-Hillsboro, OR-WA", "Poughkeepsie-Newburgh-Middletown, NY MSA", "PR NONMETROPOLITAN AREA", "Prescott, AZ", "Providence-Warwick, RI-MA", "Provo-Orem, UT", "Pueblo, CO", "Punta Gorda, FL", "Racine, WI", "Raleigh, NC", "Rapid City, SD", "Reading, PA", "Redding, CA", "Reno, NV", "Richmond, VA", "Riverside-San Bernardino-Ontario, CA", "Roanoke, VA", "Rochester, MN", "Rochester, NY", "Rockford, IL", "Rocky Mount, NC", "Rome, GA", "Sacramento--Roseville--Arden-Arcade, CA", "Saginaw, MI", "Salem, OR", "Salinas, CA", "Salisbury, MD-DE", "Salt Lake City, UT", "San Angelo, TX", "San Antonio-New Braunfels, TX", "San Diego-Carlsbad, CA", "San Francisco-Oakland-Hayward, CA", "San German-Cabo Rojo, PR MSA", "San Jose-Sunnyvale-Santa Clara, CA", "San Juan-Caguas-Guaynabo, PR MSA", "San Luis Obispo-Paso Robles-Arroyo Grande, CA", "Sandusky, OH", "Santa Barbara-Santa Maria-Goleta, CA MSA", "Santa Cruz-Watsonville, CA", "Santa Fe, NM", "Santa Rosa, CA", "Sarasota-Bradenton-Venice, FL MSA", "Savannah, GA", "SC NONMETROPOLITAN AREA", "Scranton--Wilkes-Barre--Hazleton, PA", "SD NONMETROPOLITAN AREA", "Seattle-Tacoma-Bellevue, WA", "Sebastian-Vero Beach, FL", "Sheboygan, WI", "Sherman-Denison, TX", "Shreveport-Bossier City, LA", "Sioux City, IA-NE-SD", "Sioux Falls, SD", "South Bend-Mishawaka, IN-MI", "Spartanburg, SC", "Spokane-Spokane Valley, WA", "Springfield, IL", "Springfield, MA", "Springfield, MO", "Springfield, OH", "St. Cloud, MN", "St. George, UT", "St. Joseph, MO-KS", "St. Louis, MO-IL", "State College, PA", "Stockton-Lodi, CA", "Sumter, SC", "Syracuse, NY", "Tallahassee, FL", "Tampa-St. Petersburg-Clearwater, FL", "Terre Haute, IN", "Texarkana, TX-AR", "TN NONMETROPOLITAN AREA", "Toledo, OH", "Topeka, KS", "Trenton, NJ", "Tucson, AZ", "Tulsa, OK", "Tuscaloosa, AL", "TX NONMETROPOLITAN AREA", "Tyler, TX", "UT NONMETROPOLITAN AREA", "Utica-Rome, NY", "VA NONMETROPOLITAN AREA", "Valdosta, GA", "Vallejo-Fairfield, CA", "Victoria, TX", "Vineland-Bridgeton, NJ", "Virginia Beach-Norfolk-Newport News, VA-NC", "Visalia-Porterville, CA", "VT NONMETROPOLITAN AREA", "WA NONMETROPOLITAN AREA", "Waco, TX", "Warner Robins, GA", "Washington-Arlington-Alexandria, DC-VA-MD-WV", "Waterloo-Cedar Falls, IA", "Wausau, WI", "Weirton-Steubenville, WV-OH", "Wenatchee, WA", "Wheeling, WV-OH", "WI NONMETROPOLITAN AREA", "Wichita Falls, TX", "Wichita, KS", "Williamsport, PA", "Wilmington, NC", "Winchester, VA-WV", "Winston-Salem, NC", "Worcester, MA-CT", "WV NONMETROPOLITAN AREA", "WY NONMETROPOLITAN AREA", "Yakima, WA", "Yauco, PR MSA", "York-Hanover, PA", "Youngstown-Warren-Boardman, OH-PA", "Yuba City, CA", "Yuma, AZ" ];
const countries = ['US','IN','JP','CN','IT','GB','FR','DE','BR','CA','MX','AU','ES','KR','CL','SG','TW','PL','NL','RU','AR','SE','MY','CO','CH','IL','ID','HK','BE','PH','FI','ZA','TH','TR','CZ','AT','RO','PE','VN','PT','NZ','IE','DK','AE','NO','PK','UA','EC','EG','SA','HU','GR','SK','LK','BD','UY','NG','BG','MA','CR','TN','BO','PY','VE','HR','KE','SV','GT','SI','BY','KZ','LU','PA','AF','RS','DZ','QA','JO','EE','UM','KW','LT','IS','NP','AZ','DO','BH','OM','LB','PR','AL','GH','LV','IR','CY','CM','BS','EU','MK','BA','AM','KH','HN','MO','ZW','SN','GE','AO','UG','TZ','JM','CI','AD','MU','AW','MM','MT','NI','MN','IQ','ET','AS','CS','MD','TT','BM','BN','BB','BW','LY','ZM','UZ','MZ','AX','BT','AG','YE','RW','MG','AI','PG','AQ','BJ','NE','FJ','AP','GI','BZ','CC','HT','GA'];

const THEMES = ["Storage","Training","ModAppDev_Accelerate","ModAppDev_Automate","ModAppDev_Integrate","ModAppDev_OpenShift_Enterprise","ITWOB_Efficiency","ITWOB_Transitional","ITWOB_Agility","ModAppDev_Mobile","ModAppDev_OpenShift_Dedicated","Consulting","RHEL","Satellite","RHEV","OpenStack","CloudForms","RHCI"];
const SUPER_REGIONS = ['APAC', 'EMEA', 'NA', 'LATAM'];
const PERSONAS = ['Architect', 'Business Analyst',  'IT Executive', 'IT Manager', 'Lead Developer', 'Other', 'System Administrator', 'N/A'];
const LANGUAGES = ['EN', 'ES', 'ZH', 'JA', 'DE', 'IT', 'FR', 'PT', 'KO' ];
const INDUSTRIES = ['Agriculture','Business Services','Construction & Real Estate','Education','Energy, Raw Materials & Utilities','Finance','Government','Healthcare','Leisure & Hospitality','Libraries','Manufacturing','Media & Internet','Non-Profit & Professional Orgs.','Retail','Software','Telecommunications','Transportation'];
const COMPANY_SIZE = ['Enterprise', 'Small Business', 'Mid-Market Enterprise', 'Medium Business'];

const THINGS_TO_FILTER_BY = [
    { name: 'Themes', options: THEMES },
    { name: 'SuperRegion', options: SUPER_REGIONS },
    { name: 'Language', options: LANGUAGES},
    { name: 'Persona', options: PERSONAS },
    { name: 'Size', options: COMPANY_SIZE},
    { name: 'Industry', options: INDUSTRIES }
];
const THINGS_TO_SOMETIMES_FILTER_BY = [
    { name: 'Country'},
    { name: 'Company'},
    { name: 'MetroArea'}
];

// List the available filters
// The active filter shows all options
// Non-active filters only show the header
// Click a header to toggle activated
// Click an option to toggle it in the state filters
const ChooseFilterOptions = ({ filterOptionsArray, clickFunc, activateFunc, active, selectedFilters, stats }) => {
    const thingsToFilterByMapFunc = ({ name, options }) => {
        const getFilterOptions = (option, i) => (
            <div className='filter-contents-holder' key={i} onClick={()=>clickFunc(name, option)}>
                <p>{option + (stats[name] && stats[name][option] ? ` (${stats[name][option]})` : '')}</p>
            </div>
        );
        return (
            <div key={name}>
                <div className='filter-title-holder' onClick={() => activateFunc(name)}>
                    <h4>{name}</h4>
                </div>
                {active === name ? options.filter(o => !selectedFilters[name] || !selectedFilters[name].includes(o)).map(getFilterOptions) : null}
            </div>
        );
    };
    return (<div>
        { filterOptionsArray.map(thingsToFilterByMapFunc) }
        </div>
    );
};

// Get the filters object from state
// Map to a list of options
// On click, remove from the clicked filter from the state
const SelectedOptions = ({ filters, onSelect }) => {
    const showFilter = (name) => (<div key={name}><h4>{name}</h4>{filters[name].map((val, id) => (<div key={id} onClick={() => onSelect(name, val)}><p>{val}</p></div>))}</div>);
    return (
        <div>
            {Object.keys(filters).filter(k => filters[k] && filters[k].length).map(showFilter)}
        </div>
    )
};

const MultiSelect = ({ options, name, clickFunc, activateFunc, stats}) => (<div>Whoa, dude!</div>);






