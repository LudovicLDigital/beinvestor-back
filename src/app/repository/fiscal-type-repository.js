const FiscalType = require("../models/simulator/fiscal-type");
class FiscalTypeRepository {
    static async getAll(){
        return await FiscalType.query().select();
    }
}
module.exports = FiscalTypeRepository;