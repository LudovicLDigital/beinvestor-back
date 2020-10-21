const fetch = require('node-fetch');
const Tools = require("./tools");
/**
 * recover all dvf transaction from the gouv api https://www.data.gouv.fr/fr/reuses/micro-api-dvf-demande-de-valeurs-foncieres/
 * @param cityCode the city code to recover transactions
 * @returns {Promise<Response>} return an array of all transaction on the two latest year
 */
async function getCityCodeLastestTransaction(cityCode) {
    const appartements = await fetch(`http://api.cquest.org/dvf?code_commune=${cityCode}&nature_mutation=Vente&type_local=Appartement`).then( (response) => response.json()).then( async (json) => {
        return checkForFilter(json)
    });
    const maisons = await fetch(`http://api.cquest.org/dvf?code_commune=${cityCode}&nature_mutation=Vente&type_local=Maison`).then( (response) => response.json()).then( async (json) => {
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
 * deduce the average m² price of the transactions array passed
 * @param transactionsArray the transactions array recover from the https://www.data.gouv.fr/fr/reuses/micro-api-dvf-demande-de-valeurs-foncieres/
 * @returns {number} the average price €/m²
 */
function calculateAveragePrice(transactionsArray) {
    let sumOfAll = 0;
    let countTransaction = transactionsArray.length;
    for(const transaction of transactionsArray) {
        if (transaction.valeur_fonciere === null || transaction.surface_terrain === null) {
            countTransaction = countTransaction - 1;
        } else {
            sumOfAll = sumOfAll + (transaction.valeur_fonciere / transaction.surface_terrain);
        }
    }
    return Tools.roundNumber(sumOfAll / countTransaction, 2);
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