var Promise = require('es6-promise').Promise;
var file   = require('./file');
var AWS   = require('aws-sdk');
var mime  = require('mime');
var chalk = require('chalk');

function onError(err) {
    console.log(chalk.red(err.message));
    process.exit(1);
}

function checkMandatory(key, obj){
    if (!obj[key]) {
        onError({message:'Missing config `' + key + '`'});
    }
}

function sendToS3(options){
    return new Promise(function(resolve, reject){
        console.log(options)
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

    upload : function(file, options) {
        var self = this;
        options = options || {};

        Object.keys(this.config).forEach(function(key, i){
            options[key] = options[key] || self.config[key];
        })

        options.filePath = file.path
            .replace(file.base, options.path || '')
            .replace(new RegExp('\\\\', 'g'), '/');
        options.contents = file.contents;

        checkMandatory('key', options);
        checkMandatory('secret', options);
        checkMandatory('region', options);
        checkMandatory('bucket', options);
        checkMandatory('filePath', options);
        options.params = setParams(file, options)

        return sendToS3(options)
    }
};

module.exports = aws;


//var fileName = './tasks/utils/aws.js';
//var config = {
//    bucket: process.env.AWS_SKYGLOBAL_BUCKET,
//    key: process.env.AWS_ACCESS_KEY_ID,
//    secret: process.env.AWS_SECRET_ACCESS_KEY,
//    region: process.env.AWS_REGION
//};
//var s3 = aws.setup(config)
//file.read(fileName).then(function(files){
//    return s3.upload(files[0],{path:'test'}).then(onError).catch(onError)
//}, onError)