const AccessControl = require("accesscontrol"); // package to get method for roles and permissions see docs here : https://www.npmjs.com/package/accesscontrol
const accessControlInstance = new AccessControl();
const predefinedRoles = [
    'freeUser',
    'freeNoPub',
    'premiumUser',
    'professional',
    'admin',
];
const userTable = 'user';
const userInfoTable = 'user-info';
const userTokenTable = 'user-token';
const userRolesTable = 'user-roles';
exports.roles = (function() {
    accessControlInstance.grant(predefinedRoles[0])
        .readOwn(userTable).readAny(userTable).updateOwn(userTable).deleteOwn(userTable)
        .readOwn(userInfoTable).readAny(userInfoTable).updateOwn(userInfoTable).deleteOwn(userInfoTable)
        .readOwn(userTokenTable).updateOwn(userTokenTable)
        .readOwn(userRolesTable);
    accessControlInstance.grant(predefinedRoles[3])
        .extend(predefinedRoles.slice(0, predefinedRoles.length - 1))
        .createAny(userTable).updateAny(userTable).deleteAny(userTable)
        .createAny(userInfoTable).updateAny(userInfoTable).deleteAny(userInfoTable)
        .createAny(userTokenTable).readAny(userTokenTable).updateAny(userTokenTable).deleteAny(userTokenTable)
        .createAny(userRolesTable).readAny(userRolesTable).updateAny(userRolesTable).deleteAny(userRolesTable);
    return accessControlInstance;
})();

