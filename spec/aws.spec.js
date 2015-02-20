var AWS = require('../tasks/wrappers/aws');
var fs = require('../tasks/utils/fs');
var AWSSDK   = require('aws-sdk');
var log = require('../tasks/utils/log');

function onError(e){
    console.log('** Test Error **');
    console.log(e);
    expect(false).toBe(true);
}
describe('AWS', function () {

    var awsFileObj = {};

    beforeEach(function(done){
        fs.read('./spec/fixtures/aws/aws.md').then(function(files){
            awsFileObj =  files[0];
        }).then(done);
    });

    it('always saves destination with a single trailing slash', function () {
        var aws = new AWS('src', 'dest', {});
        expect(aws.destination).toBe('dest/');
        var aws = new AWS('src', 'dest/', {});
        expect(aws.destination).toBe('dest/');
    });

    it('check the given key exists in the config object', function () {
        spyOn(log, 'onError');
        var aws = new AWS('src', 'dest', {});
        aws.checkMandatory('bill');
        expect(log.onError.calls.count()).toBe(1);

        var aws = new AWS('src', 'dest', {bucket:'Bucket'});
        aws.checkMandatory('ben');
        aws.checkMandatory('Bucket');
        expect(log.onError.calls.count()).toBe(2);
    });

    it('sets required parameters', function () {
        spyOn(log, 'onError');

        var aws = new AWS('src', 'dest', {
            accessKey: 'access key',
            secret: 'secret',
            region: 'region',
            bucket: 'Bucket'
        });

        aws.setParams(awsFileObj);

        expect(aws.params.ContentType).toBe('text/x-markdown');
        expect(aws.params.ContentLength).toBe(6);
        expect(aws.params.Key).toBe('dest/aws.md');
        expect(aws.params.Body.toString()).toBe('# AWS!');
        expect(aws.params.ACL.toString()).toBe('public-read');
        expect(aws.params.Bucket).toBe('Bucket');
    });

    it('writes the files to be uploaded', function (done) {
        spyOn(AWS.prototype, 'upload').and.callFake(function (fileObj) {
            return fileObj;
        });

        var aws = new AWS('./spec/fixtures/aws/aws.md', 'dest', {});
        aws.write().then(function () {
            expect(AWS.prototype.upload.calls.count()).toBe(1);
        }).then(done).catch(onError);
    });

    it('should upload files to S3', function (done) {
        var aws = new AWS('./spec/fixtures/aws/aws.md', 'dest', {
            accessKey: 'access key',
            secret: 'secret',
            region: 'region',
            bucket: 'Bucket'
        });
        spyOn(AWS.prototype, 'setParams');
        spyOn(AWSSDK, 'S3').and.callFake(function (params){
            expect(params.accessKeyId).toBe('access key');
            expect(params.secretAccessKey).toBe('secret');
            expect(params.region).toBe('region');
            this.putObject = function(params, cb){cb();};
        });
        aws.upload({}).then(function (msg) {
            expect(AWSSDK.S3.calls.count()).toBe(1);
            expect(AWS.prototype.setParams.calls.count()).toBe(1);
            expect(msg).toBe('S3::putObject "null" send');
        }).then(done).catch(onError);
    });
});