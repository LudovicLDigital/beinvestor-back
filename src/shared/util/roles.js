const AccessControl = require("accesscontrol"); // package to get method for roles and permissions see docs here : https://www.npmjs.com/package/accesscontrol
const accessControlInstance = new AccessControl();
const Constants = require('../constants');
exports.roles = (function() {
    accessControlInstance.grant(Constants.R_FREE)
        .readOwn(Constants.T_USER).readAny(Constants.T_USER).updateOwn(Constants.T_USER).deleteOwn(Constants.T_USER)
        .readOwn(Constants.T_USER_INFO).readAny(Constants.T_USER_INFO).updateOwn(Constants.T_USER_INFO).deleteOwn(Constants.T_USER_INFO)
        .readOwn(Constants.T_USER_TOKEN).updateOwn(Constants.T_USER_TOKEN)
        .readOwn(Constants.T_USER_ROLE)
        .readAny(Constants.T_ROLE)
        .readAny(Constants.T_GROUP)
        .createOwn(Constants.T_GROUP_MESSAGE).deleteOwn(Constants.T_GROUP_MESSAGE).updateOwn(Constants.T_GROUP_MESSAGE).readAny(Constants.T_GROUP_MESSAGE)
        .createOwn(Constants.T_USER_GROUP).deleteOwn(Constants.T_USER_GROUP).readAny(Constants.T_USER_GROUP);
    accessControlInstance.grant(Constants.R_NO_PUB)
        .extend(Constants.R_FREE);
    accessControlInstance.grant(Constants.R_PREMIUM)
        .extend(Constants.R_NO_PUB);
    accessControlInstance.grant(Constants.R_PRO)
        .extend(Constants.R_NO_PUB);
    accessControlInstance.grant(Constants.R_ADMIN)
        .extend([Constants.R_PREMIUM, Constants.R_PRO])
        .createAny(Constants.T_USER).updateAny(Constants.T_USER).deleteAny(Constants.T_USER)
        .createAny(Constants.T_USER_INFO).updateAny(Constants.T_USER_INFO).deleteAny(Constants.T_USER_INFO)
        .createAny(Constants.T_USER_TOKEN).readAny(Constants.T_USER_TOKEN).updateAny(Constants.T_USER_TOKEN).deleteAny(Constants.T_USER_TOKEN)
        .createAny(Constants.T_USER_ROLE).updateAny(Constants.T_USER_ROLE).deleteAny(Constants.T_USER_ROLE)
        .createAny(Constants.T_ROLE).updateAny(Constants.T_ROLE).deleteAny(Constants.T_ROLE)
        .createAny(Constants.T_GROUP).updateAny(Constants.T_GROUP).deleteAny(Constants.T_GROUP)
        .createAny(Constants.T_GROUP_MESSAGE).updateAny(Constants.T_GROUP_MESSAGE).deleteAny(Constants.T_GROUP_MESSAGE)
        .createAny(Constants.T_USER_GROUP).deleteAny(Constants.T_USER_GROUP);
    return accessControlInstance;
})();

