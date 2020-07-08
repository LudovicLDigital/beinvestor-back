class Tools {
    /**
     * Calcul de l'arrondi d'un nombre
     * @param {number} m nombre à arrondir
     * @param {number} dec nombre de décimales dans le résultat
     * @return {float} nombre arrondi
     */
    static roundNumber(m, dec) {
        let rounded = m;
        if (typeof dec !== "undefined" && parseInt(dec, 10) === dec) {
            let r = Math.pow(10, dec);
            rounded = Math.round(m * r) / r;
        }
        return rounded;
    }
    static convertToStringForDateTimeFormat(dateToConvert) {
        const dateInstanciate = new Date(dateToConvert);
        const month = Tools.setAzeroNeeded(dateInstanciate.getMonth() + 1);
        const day = Tools.setAzeroNeeded(dateInstanciate.getDate());
        const hour = Tools.setAzeroNeeded(dateInstanciate.getHours());
        const minute =  Tools.setAzeroNeeded(dateInstanciate.getMinutes());
        const seconde = Tools.setAzeroNeeded(dateInstanciate.getSeconds());
        return `${dateInstanciate.getFullYear()}-${month}-${day} ${hour}:${minute}:${seconde}`
    }
    static setAzeroNeeded(number) {
        return number > 10 ? number : `0${number}`;
    }
}
module.exports = Tools;