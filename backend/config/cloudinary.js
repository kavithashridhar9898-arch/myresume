const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dxwcjl27f',
    api_key: process.env.CLOUDINARY_API_KEY || '845685653682762',
    api_secret: process.env.CLOUDINARY_API_SECRET || 'CEN9KuxXcsVm1obZ2o4ZFicXzwQ',
    secure: true
});

module.exports = cloudinary;
