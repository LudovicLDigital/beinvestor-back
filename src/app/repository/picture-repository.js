const Picture = require("../models/picture");
class PictureRepository {
    static async getPictureById(id){
        return await Picture.query().findById(id)
    }
    static async saveImageDatas(picDatas){
        const picAlreadyExist = await Picture.query().where('picture.name', picDatas.name).first();
        if (!picAlreadyExist) {
            return await Picture.query().insertGraph({
                path: picDatas.path,
                name: picDatas.name
            });
        } else {
            picDatas.id = picAlreadyExist.id;
            return await Picture.query().updateAndFetchById(picAlreadyExist.id, picDatas).throwIfNotFound();
        }
    }
}
module.exports = PictureRepository;