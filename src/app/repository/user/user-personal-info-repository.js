const UserPersonalInfo = require("../../models/user/user-personal-info");
const Tools = require("../../../shared/util/tools");
class UserPersonalInfoRepository {
    static async createUserInfo(userDatas, userId){
        const convertDateTimeBirth = Tools.convertToStringForDateTimeFormat(userDatas.birthDate);
        return await UserPersonalInfo.query().insertGraph({
            firstName: userDatas.firstName,
            lastName: userDatas.lastName,
            birthDate: convertDateTimeBirth,
            userId: userId
        });
    }
    static async getUserInfoByUserId(userId){
        return await UserPersonalInfo.query()
            .where('userId', userId).first();
    }
    static async updateUserInfo(infoDatas){
        const updateInfos = new UserPersonalInfo();
        const convertDateTimeBirth = Tools.convertToStringForDateTimeFormat(infoDatas.birthDate);
        updateInfos.id = infoDatas.id;
        updateInfos.firstName = infoDatas.firstName;
        updateInfos.lastName = infoDatas.lastName;
        updateInfos.birthDate = convertDateTimeBirth;
        updateInfos.userId = infoDatas.userId;
        updateInfos.userInvestorId = infoDatas.userInvestorId;
        return await UserPersonalInfo.query().updateAndFetchById(updateInfos.id, updateInfos).throwIfNotFound();
    }
    static async linkPicture(pic, userId){
        return await UserPersonalInfo.relatedQuery('picture').for(userId).relate(pic.id);
    }
}
module.exports = UserPersonalInfoRepository;