const UserInvestorProfil = require("../../models/simulator/user-investor-profil");
const UserPersonalInfo = require("../../models/user/user-personal-info");
class UserInvestorProfilRepository {
    static async createUserInvestorProfil(userDatas, userInfoId){
        const found = await UserPersonalInfo.query().findById(userInfoId).throwIfNotFound();
        if (found && found.userInvestorId && found.userInvestorId !== null) {
            userDatas.id = found.userInvestorId;
            return UserInvestorProfilRepository.updateUserInvestorProfil(userDatas);
        } else {
            const userInvest = await UserInvestorProfil.query().insertGraph({
                professionnalSalary: userDatas.professionnalSalary,
                nbEstate: userDatas.nbEstate,
                annualRent: userDatas.annualRent,
                fiscalPart: userDatas.fiscalPart,
                actualCreditMensualities: userDatas.actualCreditMensualities,
            });
            await UserPersonalInfo.relatedQuery('investorProfil').for(userInfoId).relate(userInvest.id);
            return await userInvest;
        }
    }
    static async getUserInvestorProfilByUserInfoId(userInfoId){
        return await UserPersonalInfo.relatedQuery('investorProfil')
            .for(userInfoId).first().throwIfNotFound();
    }
    static async updateUserInvestorProfil(investorDatas){
        const updateProfil = new UserInvestorProfil();
        updateProfil.id = investorDatas.id;
        updateProfil.professionnalSalary = investorDatas.professionnalSalary;
        updateProfil.nbEstate = investorDatas.nbEstate;
        updateProfil.fiscalPart = investorDatas.fiscalPart;
        updateProfil.annualRent = investorDatas.annualRent;
        updateProfil.actualCreditMensualities = investorDatas.actualCreditMensualities;
        return await UserInvestorProfil.query().updateAndFetchById(updateProfil.id, updateProfil).throwIfNotFound();
    }
}
module.exports = UserInvestorProfilRepository;