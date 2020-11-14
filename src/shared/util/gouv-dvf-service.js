const fetch = require('node-fetch');
const Tools = require("./tools");
/**
 * recover all dvf transaction from the gouv api https://www.data.gouv.fr/fr/reuses/micro-api-dvf-demande-de-valeurs-foncieres/
 * @param code_postal the city post code to recover transactions
 * @returns {Promise<Response>} return an array of all transaction on the two latest year
 */
async function getCityCodeLastestTransaction(code_postal) {
    const appartements = await fetch(`http://api.cquest.org/dvf?code_postal=${code_postal}&nature_mutation=Vente&type_local=Appartement`).then( (response) => response.json()).then( async (json) => {
        return checkForFilter(json)
    });
    const maisons = await fetch(`http://api.cquest.org/dvf?code_postal=${code_postal}&nature_mutation=Vente&type_local=Maison`).then( (response) => response.json()).then( async (json) => {
        return checkForFilter(json)
    });
    return appartements.concat(maisons);
}
function checkForFilter(json) {
    if(json.resultats && json.resultats !== null) {
        return json.resultats.filter((transaction) => filterACorrectSell(transaction));
    } else {
        return [];
    }
}
/**
 * filter only current and latest year transaction, only 'sell' operation
 * @param transaction the object to check
 * @returns {boolean}
 */
function filterACorrectSell(transaction) {
    const currentYear = new Date().getFullYear();
    const lastYear = currentYear - 1;
    const sellYear = new Date(transaction.date_mutation).getFullYear();
    return (currentYear === sellYear || sellYear === lastYear);
}

/**
 * deduce the average m² price of the transactions array passed (use with the median)
 * @param transactionsArray the transactions array recover from the https://www.data.gouv.fr/fr/reuses/micro-api-dvf-demande-de-valeurs-foncieres/
 * @returns {number} the average price €/m²
 */
function calculateAveragePrice(transactionsArray) {
    let validValues = [];
    for(const transaction of transactionsArray) {
        if (transaction.valeur_fonciere !== null && transaction.surface_relle_bati !== null) {
            const m2 = (transaction.valeur_fonciere / transaction.surface_relle_bati);
            validValues.push(m2);
        }
    }
    let sortedArray = validValues.sort();
    let mediane = (sortedArray.length + 1) / 2;
    if (mediane % 1 === 0) {
        return Tools.roundNumber(sortedArray[mediane], 2);
    } else {
        return Tools.roundNumber((sortedArray[Math.floor(mediane)] + sortedArray[Math.ceil(mediane)]) / 2, 2);
    }
}

/**
 * Default function to recover the average price of a city with his city post code
 * @param cityCode the city post code (FR)
 * @returns {Promise<void>}
 */
async function returnPriceOfCityWithCityCode(cityCode) {
    const lastestYearsArray = await getCityCodeLastestTransaction(cityCode);
    return await calculateAveragePrice(lastestYearsArray);
}
module.exports = returnPriceOfCityWithCityCode;