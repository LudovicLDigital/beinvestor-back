const UserPersonalInfo = require("../../models/user/user-personal-info");

class UserPersonalInfoRepository {
    static async createUserInfo(userDatas, userId){
        return await UserPersonalInfo.query().insertGraph({
            firstName: userDatas.firstName,
            lastName: userDatas.lastName,
            birthDate: userDatas.birthDate,
            userId: userId
        });
    }
    static async getUserInfoByUserId(userId){
        return await UserPersonalInfo.query()
            .where('userId', userId).first();
    }
    static async updateUserInfo(infoDatas){
        const updateInfos = new UserPersonalInfo();
        updateInfos.id = infoDatas.id;
        updateInfos.firstName = infoDatas.firstName;
        updateInfos.lastName = infoDatas.lastName;
        updateInfos.birthDate = infoDatas.birthDate;
        updateInfos.userId = infoDatas.userId;
        return await UserPersonalInfo.query().updateAndFetchById(updateInfos.id, updateInfos).throwIfNotFound();
    }
    static async linkPicture(pic, userId){
        return await UserPersonalInfo.relatedQuery('picture').for(userId).relate(pic.id);
    }
}
module.exports = UserPersonalInfoRepository;