/**
 * Created by jkochuk on 10/5/16.
 */
const eloquaMap = new Map()
    .set("C_Lead_Rating___Combined1", 'Lead Rating')
    .set("C_Lead_Ranking1", 'Lead Ranking')
    .set("C_Company", 'Company')
    .set("C_Company_Size11", 'Company Size')
    .set("C_Derived__Persona1", 'Persona')
    .set("C_Industry1", 'Industry')
    .set("C_Derived_Language_Preference1", 'Language')
    .set("C_Country", 'Country');

const mysqlMap = new Map()
    .set("MLSMScore", 'Lead Rating')
    .set("MLSMRank", 'Lead Ranking')
    .set("Company", 'Company')
    .set("Size", 'Company Size')
    .set("Persona", 'Persona')
    .set("Industry", 'Industry')
    .set("Language", 'Language')
    .set("Country", 'Country')
    .set("areasOfInterest", 'Area of Interest');

const mapsAvailable = {
    eloqua: eloquaMap,
    mysql: mysqlMap
};


// Function accumulateStats takes an eloqua response's ELEMENTS field and counts the occurances for each value.
const accumulateStats = (elements, source, stats) => {
    if (source !== 'mysql' && source !== 'eloqua') {
        throw new Error('accumulateStats called without specifying the source');
    }
    const mapToUse = mapsAvailable[source];
    
    // Initialize our array if nothing was passed
    if (!stats) {
        stats = {};
        mapToUse.forEach((val) => stats[val]={});
    }
    // Accumulate values of statsMap into stats;
    for (const el of elements) {
        mapToUse.forEach((statAccumulatorName, eloquaFieldName) => {
            // Mongo will be sad if we don't escape . and $ with alternate characters
            if(el[eloquaFieldName]){
                el[eloquaFieldName] = el[eloquaFieldName].replace(/\./g, '\uff0e').replace(/\$/g, '\uff04');
            }
            // Set or increment the stats, where 'VAL' is the stat name and 'el[key]' is the stat value
            stats[statAccumulatorName][el[eloquaFieldName]] = stats[statAccumulatorName][el[eloquaFieldName]] + 1 || 1;
        });
    }
    return stats;
};

export { accumulateStats }