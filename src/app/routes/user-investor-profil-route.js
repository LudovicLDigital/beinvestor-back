const userInvestRouter = require('../../shared/config/router-configurator');
const UserInvestorProfilRepository = require('../repository/user/user-investor-profil-repository');
const ErrorHandler = require("../../shared/util/error-handler");
const Auth = require("../../shared/middleware/auth-guard");
const Access = require("../../shared/middleware/role-guard");
const Constants = require("../../shared/constants");

/** Recover a specific user investor profil by user personal info id**/
userInvestRouter.route('/api/user-investor-profil/id/:user_info_id')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ_ALL, Constants.T_USER_INVESTOR_PROFIL),  function(req, res){
        console.log(`${new Date()}===TRYING GET USER INVESTOR PROFIL RELATED TO USER INFO ID : ${req.params.user_info_id} ===`);
        UserInvestorProfilRepository.getUserInvestorProfilByUserInfoId(req.params.user_info_id).then((investProfil) => {
            res.json(investProfil);
        }).catch((err) => {
            console.error(`${new Date()} /user-investor-profil/:user_info_id GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
/**
 * Interact on the investor profil for the current user
 */
userInvestRouter.route('/api/user-investor-profil/current')
    .get(Auth.authenticationToken, Access.haveAccess(Constants.READ, Constants.T_USER_INVESTOR_PROFIL),  function(req, res){
        console.log(`${new Date()}===TRYING GET CURRENT USER INVESTOR PROFIL===`);
        UserInvestorProfilRepository.getUserInvestorProfilByUserInfoId(req.user.data.userInfo.id).then((currentInvestProfil) => {
            res.json(currentInvestProfil);
        }).catch((err) => {
            console.error(`${new Date()} /user-investor-profil/current GET HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .put(Auth.authenticationToken, Access.haveAccess(Constants.UPDATE, Constants.T_USER_INVESTOR_PROFIL),  function(req, res){
        console.log(`${new Date()}===UPDATE CURRENT USER INVESTOR PROFIL======`);
        const toUpdateInvestProfil = {
            professionnalSalary: req.body.professionnalSalary,
            nbEstate: req.body.nbEstate,
            annualRent: req.body.annualRent,
            actualCreditMensualities: req.body.actualCreditMensualities,
            id: req.body.id
        };
        UserInvestorProfilRepository.updateUserInvestorProfil(toUpdateInvestProfil).then((updatedProfil) => {
            res.json(updatedProfil);
        }).catch((err) => {
            console.error(`${new Date()} /user-investor-profil/current UPDATE HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    })
    .post(Auth.authenticationToken, Access.haveAccess(Constants.CREATE, Constants.T_USER_INVESTOR_PROFIL),  function(req, res) {
        console.log(`${new Date()} ===CREATE USER INVESTOR PROFIL FOR CURRENT USER=== ${req.user.data.userInfo.id}`);
        const toUpdateInvestProfil = {
            professionnalSalary: req.body.professionnalSalary,
            nbEstate: req.body.nbEstate,
            fiscalPart: req.body.fiscalPart,
            annualRent: req.body.annualRent,
            actualCreditMensualities: req.body.actualCreditMensualities,
        };
        UserInvestorProfilRepository.createUserInvestorProfil(toUpdateInvestProfil, req.user.data.userInfo.id).then((investProfilCreated) => {
            res.send(investProfilCreated);
        }).catch((err) => {
            console.error(`${new Date()} /user-investor-profil/current POST HAVE FAILED, error : ${err}`);
            ErrorHandler.errorHandler(err, res);
        });
    });
module.exports = userInvestRouter;