var bower = require('../bower.json');
bower.release = false;


module.exports = {
    bower: bower,
    aws:{
        release: false,
        bucket: process.env.AWS_BUCKET,
        key: process.env.AWS_ACCESS_KEY_ID,
        secret: process.env.AWS_SECRET_ACCESS_KEY,
        region: process.env.AWS_REGION
    }
};