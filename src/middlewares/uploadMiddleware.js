const path = require("path");
const multer = require("multer");

// Configure multer for image upload
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});
const uploadImage = multer({ storage: storage });

// Exporting middleware
module.exports = {
    uploadImage
};