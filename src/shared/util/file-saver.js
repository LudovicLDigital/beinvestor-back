const multer  = require('multer');
const path = require('path');
const FileSaver = {
    saveImage(req, filename) {
        const imageFilter = function(req, file, cb) {
            // Accept images only
            if (!file.originalname.match(/\.(jpg|JPG|jpeg|JPEG|png|PNG|gif|GIF)$/)) {
                req.fileValidationError = 'Only image files are allowed!';
                return cb(new Error('Only image files are allowed!'), false);
            }
            cb(null, true);
        };
        return this._registerMulter(req, filename, 'files/pictures/', imageFilter)
    },
    _registerMulter(req, filename, emplacement, filter) {
        const storage = multer.diskStorage({
            destination: function (req, file, cb) {
                cb(null, emplacement);
            },
            // By default, multer removes file extensions so let's add them back
            filename: function (req, file, cb) {
                cb(null, filename + path.extname(file.originalname));
            }
        });
        return multer({storage: storage, fileFilter: filter}).single('file');
    }
};
module.exports = FileSaver;