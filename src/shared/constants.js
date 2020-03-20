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
// USER STATUS (role)
exports.R_FREE = 'freeUser';
exports.R_NO_PUB = 'freeNoPub';
exports.R_PREMIUM = 'premiumUser';
exports.R_PRO = 'professional';
exports.R_ADMIN = 'admin';