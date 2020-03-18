const User = require("../models/user");
const UserPersonalInfoRepo = require('./user-personal-info-repository');
const PasswordCrypter = require('../../shared/util/password-crypter');
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
        const hashedPassword = await PasswordCrypter.cryptPassword(userDatas.password);
        const updateUser = new User();
        updateUser.id = userDatas.id;
        updateUser.login = userDatas.login;
        updateUser.password = hashedPassword;
        updateUser.mail = userDatas.mail;
        updateUser.phone = userDatas.phone;
        return await User.query().updateAndFetchById(updateUser.id, updateUser).throwIfNotFound();
    }
    static async deleteUser(userId) {
        return await User.query().deleteById(userId).throwIfNotFound();
    }
}
module.exports = UserRepository;