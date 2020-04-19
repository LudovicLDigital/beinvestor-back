const User = require("../../models/user/user");
const UserPersonalInfoRepo = require('./user-personal-info-repository');
const UserRolesRepository = require('../roles/user-roles-repository');
const PasswordCrypter = require('../../../shared/util/password-crypter');
class UserRepository {
    static async createUser(userDatas){
         const hashedPassword = await PasswordCrypter.cryptPassword(userDatas.password);
         const userSaved = await User.query().insertGraph({
            login: userDatas.login,
            password: hashedPassword,
            mail: userDatas.mail,
            phone: userDatas.phone
        });
        await UserPersonalInfoRepo.createUserInfo(userDatas, userSaved.id);
        await UserRolesRepository.createUserRole(userSaved.id, 1);
        return userSaved;
    }
    static async getAllUser(){
        return await User.query();
    }
    static async getUserById(userId){
        return await User.query().findById(userId).throwIfNotFound();
    }
    static async getUserByLogin(login){
        return await User.query().where('login', login).throwIfNotFound();
    }
    static async updateUser(userDatas){
        const updateUser = new User();
        updateUser.id = userDatas.id;
        updateUser.login = userDatas.login;
        if (userDatas.password) {
            const hashedPassword = await PasswordCrypter.cryptPassword(userDatas.password);
            updateUser.password = hashedPassword;
        }
        updateUser.mail = userDatas.mail;
        updateUser.phone = userDatas.phone;
        updateUser.updated_at = new Date();
        if(userDatas.userInfo === null) {
            return await User.query().updateAndFetchById(updateUser.id, updateUser).throwIfNotFound();
        } else {
            const user = await User.query().updateAndFetchById(updateUser.id, updateUser).throwIfNotFound();
            return new Promise((resolve, reject) => {
                UserPersonalInfoRepo.updateUserInfo(userDatas.userInfo).then((userInfo) => {
                    const data = {
                        user: user,
                        userInfo: userInfo
                    };
                    resolve(data);
                }).catch((onError) => reject(onError));
            });
        }
    }
    static async deleteUser(userId) {
        return await User.query().deleteById(userId).throwIfNotFound();
    }
}
module.exports = UserRepository;