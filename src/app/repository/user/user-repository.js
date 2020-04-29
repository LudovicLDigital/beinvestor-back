const User = require("../../models/user/user");
const UserPersonalInfoRepo = require('./user-personal-info-repository');
const UserRolesRepository = require('../roles/user-roles-repository');
const PasswordCrypter = require('../../../shared/util/password-crypter');
class UserRepository {
    static async createUser(userDatas){
        const hashedPassword = await PasswordCrypter.cryptPassword(userDatas.password);
        const userSaved = await User.query().insertGraphAndFetch({
            login: userDatas.login,
            password: hashedPassword,
            mail: userDatas.mail,
            phone: userDatas.phone,
            activated: false,
            activationCode: userDatas.activationCode,
        });
        try {
            await UserPersonalInfoRepo.createUserInfo(userDatas.userInfo, userSaved.id);
            await UserRolesRepository.createUserRole(userSaved.id, 1);
        } catch(e) {
            if (e) {
                await User.query().deleteById(userSaved.id);
            }
        }
        return {mail: userSaved.mail, id: userSaved.id};
    }
    static async getAllUser(){
        return await User.query();
    }
    static async getUserById(userId){
        return await User.query().findById(userId).throwIfNotFound();
    }
    static async getUserByLogin(login){
        return await User.query().where('login', login).first().throwIfNotFound();
    }
    static async getUserByActivationKey(activationKey) {
        return await User.query().where('activationCode', activationKey).first().throwIfNotFound();
    }
    static async getUserByMail(mail) {
        return await User.query().where('mail', mail).first().throwIfNotFound();
    }
    static async changeUserPassword(newPassword, userId) {
        const updateUser = new User();
        if (newPassword && newPassword !== null && newPassword.trim() !== '') {
            updateUser.id = userId;
            updateUser.password = await PasswordCrypter.cryptPassword(newPassword);
            return await User.query().updateAndFetchById(userId, updateUser).throwIfNotFound();
        } else {
            throw 'NO PASSWORD VALID';
        }
    }
    static async updateUser(userDatas){
        const updateUser = new User();
        updateUser.id = userDatas.id;
        updateUser.login = userDatas.login;
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
    static async activateUserAccount(userToActivate) {
        userToActivate.activationCode = null;
        userToActivate.activated = true;
        userToActivate.updated_at = new Date();
        return await User.query().updateAndFetchById(userToActivate.id, userToActivate).throwIfNotFound();
    }
    static async updateActivationKey(userWithCode) {
        userWithCode.updated_at = new Date();
        return await User.query().updateAndFetchById(userWithCode.id, userWithCode).throwIfNotFound();
    }
    static async deleteUser(userId) {
        return await User.query().deleteById(userId).throwIfNotFound();
    }
}
module.exports = UserRepository;