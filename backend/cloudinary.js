// cloudinary.js
const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: 'ddzkomshk',
  api_key: '311653895872223',
  api_secret: '2yIhPD16d4PzgDzbL8cGAkV-i3w',
  secure: true,
});

const uploadToCloudinary = (file) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: 'demo-image' }, (error, result) => {
      if (error) return reject(error);
      return resolve(result);
    }).end(file.buffer);
  });
};

module.exports = { uploadToCloudinary };
