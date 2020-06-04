// PERMISSIONS
exports.READ_ALL = 'readAny';
exports.UPDATE_ALL = 'updateAny';
exports.DELETE_ALL = 'deleteAny';
exports.CREATE_ALL = 'createAny';
exports.READ = 'readOwn';
exports.UPDATE = 'updateOwn';
exports.DELETE = 'deleteOwn';
exports.CREATE = 'createOwn';
// TABLES TO ACCESS
exports.T_ROLE = 'role';
exports.T_USER = 'user';
exports.T_USER_INFO = 'user-info';
exports.T_USER_TOKEN = 'user-token';
exports.T_USER_ROLE = 'user-roles';
exports.T_GROUP = 'groups';
exports.T_GROUP_MESSAGE = 'group_message';
exports.T_USER_GROUP = 'user-groups';
exports.T_CITY = 'city';
exports.T_GEO_ADRESS = 'geo_adress';
exports.T_PICTURE = 'picture';
exports.T_FISCAL_TYPE = 'fiscal_type';
// SIMULATOR
exports.SIMULATOR = 'permForSimulator';
// USER STATUS (role)
exports.R_FREE = 'freeUser';
exports.R_NO_PUB = 'freeNoPub';
exports.R_PREMIUM = 'premiumUser';
exports.R_PRO = 'professional';
exports.R_ADMIN = 'admin';
// Errors
exports.BAD_REQUEST = 'Bad Request';
exports.UNAUTHORIZE = 'Unauthorize';
exports.ERROR_400_FUNC = function (errorMessage) {
    return new Promise(((resolve, reject) =>
            reject({
                type: 'Bad Request',
                message: errorMessage
            })
    ));
};
// MAILS FILES
exports.MAIL_PASS_CHANGED = 'mail-password-changed';
exports.MAIL_ACCOUNT_ACTIVATION_REQUIRED = 'mail-confirm-account';
exports.MAIL_PASSWORD_RESET_REQUESTED = 'mail-reset-password-key';
// FILES DIRECTORIES NAME
exports.USER_PIC = 'user-profil-picture';
// OTHER CONSTANT
exports.PAGING_ITEM_LIMIT = 15;


// utilitary
exports.SECOND = 1000;
exports.MINUTE = 60 * 1000;
exports.HOUR = 3600 * 1000;
exports.DAY = 86400 * 1000;