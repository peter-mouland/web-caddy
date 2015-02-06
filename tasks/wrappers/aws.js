var Promise = require('es6-promise').Promise;
var AWSSDK   = require('aws-sdk');
var mime  = require('mime');
var log = require('../utils/log');
var fs = require('../utils/fs');

function AWS(location, destination, options){
    this.location = location;
    this.destination = this.addSlash(destination);
    this.config = {
        accessKey: options.accessKey || process.env.AWS_ACCESS_KEY_ID || null,
        secret: options.secret || process.env.AWS_SECRET_ACCESS_KEY || null,
        region: options.region || process.env.AWS_REGION || null
    };
    this.params = {
        Bucket : options.bucket || process.env.AWS_BUCKET || null,
        ACL    : options.acl || 'public-read',
        Key    : null,
        Body   : null
    };
}

AWS.prototype.addSlash = function(dir){
    if (dir.slice(-1) !== '/') dir = dir +'/'
    return dir
}

AWS.prototype.checkMandatory = function(key){
    if (!this.config[key] && !this.params[key]) {
        log.onError({message:'AWS: Missing config `' + key + '`'});
    }
}

AWS.prototype.setParams = function(fileObj){

    this.checkMandatory('accessKey');
    this.checkMandatory('secret');
    this.checkMandatory('region');
    this.checkMandatory('Bucket');

    if (fileObj.ext) {
        this.params.ContentType = mime.lookup(fileObj.path);
    }
    if (fileObj.stat) {
        this.params.ContentLength = fileObj.stat.size;
    }
    console.log(fileObj.base)
    console.log(this.destination )
    this.params.Key = fileObj.path
        .replace(fileObj.base, this.destination || '')
        .replace(new RegExp('\\\\', 'g'), '/');
    this.params.Body = fileObj.contents;
}

AWS.prototype.upload = function(fileObj) {
    var self = this;
    this.setParams(fileObj)
    return new Promise(function(resolve, reject){
        var s3 = new AWSSDK.S3({
            accessKeyId     : self.config.accessKey,
            secretAccessKey : self.config.secret,
            region          : self.config.region
        });

        s3.putObject(self.params, function(err) {
            if (err) {
                reject({message: 'S3::putObject "' + self.params.Key + '" error!\n' + err});
            } else {
                resolve('S3::putObject "' + self.params.Key + '" send');
            }
        });
    });
};

AWS.prototype.write = function(){
    var self = this;
    return fs.read(this.location).then(function(files){
        if (!files.length) log.info('No files found to release to AWS\n' + self.location)
        var promises = []
        files.forEach(function(fileObj){
            promises.push(self.upload(fileObj))
        })
        return Promise.all(promises);
    }).catch(log.onError)
}

module.exports = AWS;
