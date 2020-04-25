const ErrorHandler = require("../../shared/util/error-handler");;
const UserRolesRepository = require('../../app/repository/roles/user-roles-repository');
const UserTokenRepository = require('../../app/repository/user/user-token-repository');
const jwt = require('jsonwebtoken');
const TokenSaver = {
    /**
     * Generate or update the user refresh token in database which will be logged
     * @param req http request parameters
     * @param res http response object
     * @param userFound the user recovered with the passed password and login
     */
    generateAndSaveUserFoundToken(req, res, userFound) {
        UserRolesRepository.getAllPassedUserRoles(userFound.id).then((userRoles) => {
            userFound.roles = userRoles;
            let accessToken = TokenSaver.generateToken(userFound);
            let refreshToken = jwt.sign({data: userFound}, process.env.REFRESH_TOKEN_SECRET);
            console.log(`====TRYING TO CREATE A NEW TOKEN WITH USER ID : ${userFound.id}===`);
            UserTokenRepository.createToken(userFound.id, refreshToken).then(() => {
                refreshToken = refreshToken.replace(/"/g, '');
                accessToken = accessToken.replace(/"/g, '');
                res.json({accessToken: accessToken, refreshToken: refreshToken})
            }).catch((err) => {
                if (err && err.constraint === 'userId_is_unique') {
                    console.log(`====USERID EXISTING IN DB, TRYING TO UPDATE TOKEN NOW===`);
                    UserTokenRepository.updateToken(userFound.id, refreshToken).then(() => {
                        refreshToken = refreshToken.replace(/"/g, '');
                        accessToken = accessToken.replace(/"/g, '');
                        res.json({accessToken: accessToken, refreshToken: refreshToken})
                    }).catch((err) => {
                        console.log(`updateToken HAVE FAILED, error : ${err}`);
                        ErrorHandler.errorHandler(err, res);
                    });
                } else {
                    console.log(`/login HAVE FAILED to createToken in db, error : ${err}`);
                    ErrorHandler.errorHandler(err, res);
                }
            });
        }).catch((err) => {
            console.log(`getAllPassedUserRoles HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    },
    generateToken(user) {
        return jwt.sign({data: user}, process.env.ACCESS_TOKEN_SECRET, {expiresIn: '3600s'})
    }
};
module.exports = TokenSaver;