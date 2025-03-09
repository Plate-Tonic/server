const path = require("path");
const multer = require("multer");

// Middleware to upload images
const storage = multer.diskStorage({
    // Specify the directory to store uploaded files
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "../../uploads"));
    },

    // Specify the filename for uploaded file
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

const uploadImage = multer({ storage: storage });

module.exports = {
    uploadImage
};