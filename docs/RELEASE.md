# Caddy Release

There are a number of use cases for release:

 * [Bower](#deploying-to-bower)
 * [Amazon S3](#deploying-to-amazon-s3)
 * [github.io](#deploying-to-github.io)

## Deploying to Bower

> Simply tag and push you code using git

Please note: we do not recommend adding a `dist` directory to git.  
If you need a dist directory, then [deploy to the S3](#deploying-to-amazon-s3).

*Creating a dist directory*
```javascript
    buildPaths: [
        { source: "./src",  "target": './dist' , minify: true}
    ],
```

## Deploying to S3

> If the deployment timed out at the last step, you can redeploy to the s3 in isolation

`caddy release s3`

This will push the current files from within `_site` to S3 using the options within [caddy.config.js](boilerplate/caddy.config.js).
Setting this option to false will prevent a release.

**Example 1: Using Environment Variables**

*caddy.config.js*
```javascript
...
    tasks: {
        release: ['s3']
    },
    s3: {
        baseDir: '_site,
        bucket: 'bucket-for-your-project',
        region: 'eu-west-1',
        accessKey: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        target: 'components/'
    },
...
```

**Example 2: Using AWS Credentials**

*caddy.config.js*
```javascript
...
    tasks: {
        release: ['s3']
    },
    s3: {
        bucket: 'bucket-for-your-project',
        region: 'eu-west-1',
        profile: pkg.name,
        directoryPrefix: false
    },
...
```
Ensure you have created the file : `~/.aws/credentials`. For more information see [Credentials in the AWS](http://blogs.aws.amazon.com/security/post/Tx3D6U6WSFGOK2H/A-New-and-Standardized-Way-to-Manage-Credentials-in-the-AWS-SDKs#).

```yml
    [s3-profile-name]
    aws_access_key_id = ACCESS_KEY
    aws_secret_access_key = SECRET_KEY
    aws_session_token = TOKEN
```

## Deploying to Github.io

> To push an update to the demo pages

`caddy release gh-pages`

This will push the current files within `paths.target` to gh-pages branch (making your demo available on github.io).

*caddy.config.js*
```javascript
...
    tasks: {
        release: ['gh-pages']
    }
...
```
