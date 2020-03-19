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

    }
    static async updateUserInfo(req){

    }
}
module.exports = UserPersonalInfoRepository;