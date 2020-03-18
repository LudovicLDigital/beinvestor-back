const bcrypt = require('bcrypt');
const salt = 15;
class PasswordCrypter {
    static cryptPassword(passwordToHash) {
        return bcrypt.hashSync(passwordToHash, salt);
    }
    static comparePassword(passwordFromDB, passwordReceived) {
        return bcrypt.compare(passwordReceived, passwordFromDB);
    }
}
module.exports = PasswordCrypter;