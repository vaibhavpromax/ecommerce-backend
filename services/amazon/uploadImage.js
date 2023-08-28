require("dotenv").config();
const multer = require("multer");
const AWS = require("aws-sdk");
const multerS3 = require("multer-s3");

// Configure AWS SDK
AWS.config.update({
  accessKeyId: process.env.AWS_S3_ACCESS_KEY,
  secretAccessKey: process.env.AWS_S3_SECRET_KEY,
});

const s3 = new AWS.S3();

// Configure Multer and Multer-S3
const uploadImage = multer({
  storage: multerS3({
    s3: s3,
    bucket: "ecommerce-images",
    acl: "public-read",
    contentType: multerS3.AUTO_CONTENT_TYPE,
    metadata: (req, file, cb) => {
      cb(null, { fieldName: file.fieldname });
    },
    key: (req, file, cb) => {
      cb(null, Date.now().toString());
    },
  }),
});

// const uploadImage = (req, res) => {
//   // 'image' is the name of the file input field in the form
//   let imageUrl;
//   upload.single("image")(req, res, (err) => {
//     if (err) {
//       // Handle error
//       return [null, err];
//     }
//     // File uploaded successfully
//     imageUrl = req.file.location;
//   });
//   console.log(imageUrl);
//   return [imageUrl, null];
// };

// const uploadImage = multer({
//   storage: upload,
//   // fileFilter: (req, file, callback) => {
//   //   sanitizeFile(file, callback);
//   // },
//   // limits: {
//   //   fileSize: 1024 * 1024 * 2, // 2mb file size
//   // },
// });

module.exports = uploadImage;
