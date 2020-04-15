const GeoLocater = {
    /**
     * Permet de retrouver le min et le maximum pour les longitudes et latitude autour d'un point avec un cercle
     * Le resultat retourné peut être utilisé dans une requete SQL avec un "BETWEEN 'latitudeMin' AND 'latitudeMax'" par exemple
     * @param positionCenter est un object tel que : positionCenter: {latitude: number, longitude: number}
     * @param cercleDistance est la distance en km souhaitée pour le rayon du cercle à tracer autour de positionCenter
     * @return Object un Object contenant les données : latitudeMin, latitudeMax, longitudeMin, longitudeMax
     */
    recoverLongitudesLatitudesMax(positionCenter, cercleDistance) {
        // centre du cercle
        const latitudeBase = positionCenter.latitude;
        const longitudeBase = positionCenter.longitude;

        // ecart permis sur la latitude en degre
        const deltaLatitude = cercleDistance / 114;

        // ecart permis sur la longitude en degre
        let deltaLongitude;
        if (Math.abs(latitudeBase) >= 0 && Math.abs(latitudeBase) < 10) deltaLongitude = cercleDistance / 111;
        if (Math.abs(latitudeBase) >= 10 && Math.abs(latitudeBase) < 20) deltaLongitude = cercleDistance / 110;
        if (Math.abs(latitudeBase) >= 20 && Math.abs(latitudeBase) < 30) deltaLongitude = cercleDistance / 105;
        if (Math.abs(latitudeBase) >= 30 && Math.abs(latitudeBase) < 40) deltaLongitude = cercleDistance / 96;
        if (Math.abs(latitudeBase) >= 40 && Math.abs(latitudeBase) < 50) deltaLongitude = cercleDistance / 85;
        if (Math.abs(latitudeBase) >= 50 && Math.abs(latitudeBase) < 60) deltaLongitude = cercleDistance / 72;
        if (Math.abs(latitudeBase) >= 60 && Math.abs(latitudeBase) < 70) deltaLongitude = cercleDistance / 56;
        if (Math.abs(latitudeBase) >= 70 && Math.abs(latitudeBase) < 80) deltaLongitude = cercleDistance / 38;
        if (Math.abs(latitudeBase) >= 80 && Math.abs(latitudeBase) < 90) deltaLongitude = cercleDistance / 19;
        if (Math.abs(latitudeBase) >= 90) deltaLongitude = 180;

        // bornes min/max des latitudes/latitudes
        const latitudeMin = latitudeBase - deltaLatitude;
        const latitudeMax = latitudeBase + deltaLatitude;
        const longitudeMin = longitudeBase - deltaLongitude;
        const longitudeMax = longitudeBase + deltaLongitude;
        return {
            latitudeMin: latitudeMin,
            latitudeMax: latitudeMax,
            longitudeMin: longitudeMin,
            longitudeMax: longitudeMax,
        };
    }
};
module.exports = GeoLocater;
