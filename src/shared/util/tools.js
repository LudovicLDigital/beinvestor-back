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
}
module.exports = Tools;