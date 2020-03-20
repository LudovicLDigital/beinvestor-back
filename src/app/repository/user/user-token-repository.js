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
        return await UserToken.query().where('refreshToken', tokenSearched).throwIfNotFound();
    }
    static async updateToken(userId, newRefreshedToken){
        return UserToken.query().where('userId', userId).then(async(tokenFound) => {
            tokenFound[0].refreshToken = newRefreshedToken;
            return await UserToken.query().updateAndFetchById(tokenFound[0].id, tokenFound[0]).throwIfNotFound();
        });
    }
    static async deleteToken(tokenToDelete) {
        return await UserToken.query().delete().where('refreshToken', tokenToDelete).throwIfNotFound();
    }
}
module.exports = UserTokenRepository;