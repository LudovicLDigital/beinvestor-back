const UserToken = require("../../models/user/user-token");
class UserTokenRepository {
    static async createToken(userId, refreshToken){
        const userToken = await UserToken.query().insertGraph({
            userId: userId,
            refreshToken: refreshToken,
        });
        return userToken;
    }
    static async getTokenSaved(tokenSearched){
        return await UserToken.query().select().where('refreshToken', 'LIKE', tokenSearched).throwIfNotFound();
    }
    static async updateToken(userId, newRefreshedToken){
        const userToken = await UserToken.query().select().where('userId', userId).first();
        userToken.refreshToken = newRefreshedToken;
        userToken.updated_at = new Date();
        return await UserToken.query().update(userToken).where('id', userToken.id).throwIfNotFound();
    }
    static async deleteToken(tokenToDelete) {
        return await UserToken.query().delete().where('refreshToken', tokenToDelete).throwIfNotFound();
    }
}
module.exports = UserTokenRepository;