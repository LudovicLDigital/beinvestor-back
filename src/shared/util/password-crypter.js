const bcrypt = require('bcrypt');
const salt = 15;
class PasswordCrypter {
    static cryptPassword(passwordToHash) {
        return bcrypt.hashSync(passwordToHash, salt);
    }
    static comparePassword(passwordFromDB, passwordReceived) {
        return new Promise(((resolve, reject) => {
            bcrypt.compare(passwordReceived, passwordFromDB, function(err, result) {
                if (err) {
                    reject(err);
                } else {
                    resolve(result);
                }
            });
        }));
    }
}
module.exports = PasswordCrypter;