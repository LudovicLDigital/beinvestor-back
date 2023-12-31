const AccessControl = require("accesscontrol"); // package to get method for roles and permissions see docs here : https://www.npmjs.com/package/accesscontrol
const accessControlInstance = new AccessControl();
const Constants = require('../constants');
exports.roles = (function() {
    accessControlInstance.grant(Constants.R_FREE)
        .readOwn(Constants.T_USER).readAny(Constants.T_USER).updateOwn(Constants.T_USER).deleteOwn(Constants.T_USER)
        .readOwn(Constants.T_USER_INFO).readAny(Constants.T_USER_INFO).updateOwn(Constants.T_USER_INFO).deleteOwn(Constants.T_USER_INFO)
        .readOwn(Constants.T_USER_TOKEN).deleteOwn(Constants.T_USER_TOKEN).updateOwn(Constants.T_USER_TOKEN)
        .readOwn(Constants.T_USER_ROLE)
        .readOwn(Constants.T_USER_INVESTOR_PROFIL).createOwn(Constants.T_USER_INVESTOR_PROFIL).deleteOwn(Constants.T_USER_INVESTOR_PROFIL).readAny(Constants.T_USER_INVESTOR_PROFIL).updateOwn(Constants.T_USER_INVESTOR_PROFIL)
        .readAny(Constants.T_ROLE)
        .readAny(Constants.T_GROUP)
        .readAny(Constants.T_CITY)
        .readOwn(Constants.SIMULATOR)
        .readOwn(Constants.T_FISCAL_TYPE)
        .readAny(Constants.T_PICTURE).updateOwn(Constants.T_PICTURE).deleteOwn(Constants.T_PICTURE).createOwn(Constants.T_PICTURE)
        .readAny(Constants.T_GEO_ADRESS).createOwn(Constants.T_GEO_ADRESS).updateOwn(Constants.T_GEO_ADRESS).deleteOwn(Constants.T_GEO_ADRESS)
        .createOwn(Constants.T_GROUP_MESSAGE).deleteOwn(Constants.T_GROUP_MESSAGE).updateOwn(Constants.T_GROUP_MESSAGE).readAny(Constants.T_GROUP_MESSAGE)
        .createOwn(Constants.T_USER_GROUP).deleteOwn(Constants.T_USER_GROUP).readAny(Constants.T_USER_GROUP);
    accessControlInstance.grant(Constants.R_NO_PUB)
        .extend(Constants.R_FREE);
    accessControlInstance.grant(Constants.R_PREMIUM)
        .extend(Constants.R_NO_PUB)
        .readAny(Constants.SIMULATOR);
    accessControlInstance.grant(Constants.R_PRO)
        .extend(Constants.R_NO_PUB);
    accessControlInstance.grant(Constants.R_ADMIN)
        .extend([Constants.R_PREMIUM, Constants.R_PRO])
        .createAny(Constants.T_USER).updateAny(Constants.T_USER).deleteAny(Constants.T_USER)
        .createAny(Constants.T_USER_INFO).updateAny(Constants.T_USER_INFO).deleteAny(Constants.T_USER_INFO)
        .createAny(Constants.T_USER_TOKEN).readAny(Constants.T_USER_TOKEN).updateAny(Constants.T_USER_TOKEN).deleteAny(Constants.T_USER_TOKEN)
        .createAny(Constants.T_USER_ROLE).updateAny(Constants.T_USER_ROLE).deleteAny(Constants.T_USER_ROLE)
        .createAny(Constants.T_USER_INVESTOR_PROFIL).updateAny(Constants.T_USER_INVESTOR_PROFIL).deleteAny(Constants.T_USER_INVESTOR_PROFIL)
        .createAny(Constants.T_ROLE).updateAny(Constants.T_ROLE).deleteAny(Constants.T_ROLE)
        .createAny(Constants.T_GROUP).updateAny(Constants.T_GROUP).deleteAny(Constants.T_GROUP)
        .createAny(Constants.T_CITY).updateAny(Constants.T_CITY).deleteAny(Constants.T_CITY)
        .createAny(Constants.T_GEO_ADRESS).deleteAny(Constants.T_GEO_ADRESS).updateAny(Constants.T_GEO_ADRESS)
        .createAny(Constants.T_GROUP_MESSAGE).updateAny(Constants.T_GROUP_MESSAGE).deleteAny(Constants.T_GROUP_MESSAGE)
        .createAny(Constants.T_USER_GROUP).deleteAny(Constants.T_USER_GROUP);
    return accessControlInstance;
})();

