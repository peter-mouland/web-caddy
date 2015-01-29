var Promise = require('es6-promise').Promise;
var AWS   = require('aws-sdk');
var mime  = require('mime');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function checkMandatory(key, obj){
    if (!obj[key]) {
        onError({message:'AWS: Missing config `' + key + '`'});
    }
}

function sendToS3(options){
    return new Promise(function(resolve, reject){
        var s3 = new AWS.S3({
            accessKeyId     : options.key,
            secretAccessKey : options.secret,
            region          : options.region
        });
        s3.putObject(options.params, function(err) {
            if (err) {
                reject({message: 'S3::putObject "' + options.filePath + '" error!\n' + err});
            } else {
                resolve('S3::putObject "' + options.filePath + '" send');
            }
        });
    })
}

function setParams(file, options){
    var params = {
        Bucket : options.bucket,
        Key    : options.filePath,
        ACL    : options.acl,
        Body   : options.contents
    };
    if (file.ext) {
        params['ContentType'] = mime.lookup(file.path);
        Object.keys(options.params || {}).forEach(function(key, i){
            params[key] = options.params[key]
        });
        if (file.stat) {
            params['ContentLength'] = file.stat.size;
        }
    }
    return params;
}

function setup(config){
    config = config || {};
    return {
        key: config.key || process.env.AWS_ACCESS_KEY_ID || null,
        secret: config.secret || process.env.AWS_SECRET_ACCESS_KEY || null,
        region: config.region || process.env.AWS_REGION || null,
        bucket: config.bucket || process.env.AWS_BUCKET || null,
        acl: config.acl || 'public-read',
        path: config.path || ''
    };
}


var aws = {
    config : {},

    setup : function(config) {
        this.config = setup(config);
        return this;
    },

    upload : function(fileObj, options) {
        var self = this;
        options = options || {};

        Object.keys(this.config).forEach(function(key, i){
            options[key] = options[key] || self.config[key];
        })

        options.filePath = fileObj.path
            .replace(fileObj.base, options.path || '')
            .replace(new RegExp('\\\\', 'g'), '/');
        options.contents = fileObj.contents;

        checkMandatory('key', options);
        checkMandatory('secret', options);
        checkMandatory('region', options);
        checkMandatory('bucket', options);
        checkMandatory('filePath', options);
        options.params = setParams(fileObj, options)

        return sendToS3(options)
    }
};

module.exports = aws;
