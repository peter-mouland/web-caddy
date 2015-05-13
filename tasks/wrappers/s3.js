var Promise = require('es6-promise').Promise;
var AWSSDK = require('aws-sdk');
var mime = require('mime');
var log = require('../utils/log');
var fs = require('../utils/fs');

function AWS(location, destination, options){
    this.location = location;
    this.destination = this.addSlash(destination);
    AWSSDK.config.update({region: options.region || process.env.AWS_REGION || null});
    var credentials;
    if (options.profile) {
        credentials = new AWSSDK.SharedIniFileCredentials({profile: options.profile});
    }
    var auth;
    if (credentials) {
        auth = { credentials: credentials };
    } else if (options.accessKey && options.secret) {
        auth = {
            accessKeyId: options.accessKey,
            secretAccessKey: options.secret
        };
    }
    this.s3 = new AWSSDK.S3(auth);

    this.params = {
        Bucket : options.bucket || null,
        ACL    : options.acl || 'public-read',
        Key    : null,
        Body   : null
    };
}

AWS.prototype.addSlash = function(dir){
    if (dir.slice(-1) !== '/') dir = dir +'/';
    if (dir === '/') dir = dir.substring(1);
    return dir;
};

AWS.prototype.checkMandatory = function(key){
    if (!this.params[key]) {
        log.onError({message:'AWS: Missing config `' + key + '`'});
    }
};

AWS.prototype.setParams = function(fileObj){
    this.checkMandatory('Bucket');

    if (fileObj.ext) {
        this.params.ContentType = mime.lookup(fileObj.path);
    }
    if (fileObj.stat) {
        this.params.ContentLength = fileObj.stat.size;
    }
    this.params.Key = fileObj.path
        .replace(fileObj.base, this.destination || '')
        .replace(new RegExp('\\\\', 'g'), '/');
    this.params.Body = fileObj.contents;
};

AWS.prototype.upload = function(fileObj) {
    var self = this;
    return new Promise(function(resolve, reject){
        self.setParams(fileObj);
        self.s3.putObject(self.params, function(err) {
            if (err) {
                reject({message: 'S3::putObject "' + self.params.Key + '" error!\n' + err});
            } else {
                var msg ='   * "' + fileObj.relativeDir + fileObj.name + '" ';
                log.info(msg);
                resolve(msg);
            }
        });
    });
};

AWS.prototype.write = function(){
    var self = this;
    return fs.read(this.location).then(function(files){
        if (!files.length) log.info('No files found to release to AWS\n' + self.location);
        var promises = [];
        files.forEach(function(fileObj){
            promises.push(self.upload(fileObj));
        });
        return Promise.all(promises);
    });
};

module.exports = AWS;
