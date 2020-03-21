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
exports.T_USER_GROUP = 'user-groups';
// USER STATUS (role)
exports.R_FREE = 'freeUser';
exports.R_NO_PUB = 'freeNoPub';
exports.R_PREMIUM = 'premiumUser';
exports.R_PRO = 'professional';
exports.R_ADMIN = 'admin';
// Errors
exports.BAD_REQUEST = 'Bad Request';
exports.ERROR_400_FUNC = function (errorMessage) {
    return new Promise(((resolve, reject) =>
            reject({
                type: 'Bad Request',
                message: errorMessage
            })
    ));
};