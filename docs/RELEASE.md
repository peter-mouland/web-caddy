# Release Process

There are a number of use cases for release:

 * [Continuous deployment](#continuous-deployment)
 * [Manual deployment](#manual-deployment)
 * [Bower](#deploying-to-bower)
 * [Amazon S3](#deploying-to-amazon-s3)
 * [github.io](#deploying-to-github.io)
 * [Bump](#bump-the-version)

## Continuous Deployment

> This method relies on the version number being incremented manually before code is pushed to Git.

**Submitting a PR**
 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * `npm test` : Run the tests

**Accepting a PR**
 * Switch to the PR branch and review code
 * `npm test` : Run the tests
 * Merge the PR into master
 * `npm test` : Run the tests again
 * `npm run report` :  take a look at the code coverage report
 * `npm run bump`
   * alternatively run `npm run bump -- [-patch|-minor|-major|-vx.x.x]`. [more info >](#bump-the-version).
 * `git push` : to kick of the deploy process

CircleCI will then run your tests, and if successful:
 * Tag the version number and push to Git
 * Push the demo `site` to github.io (if configured)
 * Push the compiled assets to the S3 (if configured)

Your `circle.yml` should look something like:

```yml
test:
  pre:
    - bower i
  post:
    - git config --global user.name "circleci"
    - git config --global user.email "{{ git.email }}"
general:
  artifacts:
    - test/coverage
deployment:
  production:
    branch: master
    commands:
      - ./node_modules/web-caddy/bin/caddy release current
machine:
  node:
    version: v0.10.33
```

## Manual Deployment

> This method relies on the tests being run locally.

`caddy release`

   * [Version Bump](#version-bump) if you need to.
   * Tag the version number and push to Git
   * Push the demo `site` to github.io
   * Push the compiled assets to the S3 (if configured)

It is recommended you update your package.json `scripts` object to automatically run tests first (see [TESTING.md](TESTING.md)):

```javascript
  "release": "npm test && caddy release"
```

You can then run `npm run release` to release. Feel free to setup shortcuts for any other release types.

Your `circle.yml` should look something like:

```yml
test:
  pre:
    - bower i
general:
  artifacts:
    - test/coverage
machine:
  node:
    version: v0.10.33
```

## Deploying to Bower

> Putting your code into Bowers registry so that other can `bower install`

You must first initialise Bower (See [INITIALISING.md#bower](INITIALISING.md#bower)).

This will make files available to bower that match the `ignore` object within your bower.json (even if they are in your .gitignore file).

*caddy.config.js*
```javascript
...
    tasks: {
        release: ['bower']
    }
...
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

## Version Bump

> Bump the version within your app

`caddy bump`

The files `package.json`, `app.json` and `README.md` are bumped by default. To specify different files you can add a bump task i.e.

*caddy.config.js*
```javascript
...
    tasks: {
        bump: ['package.json','README.md', '*/app.json']
    }
...
```

It is recommended you update your package.json `scripts` object:

*package.json*
```javascript
  "bump": "caddy bump"
```

By default, this applies a  `patch`.  Add either `patch`, `minor`, `major`, `prerelease` or even `v3.2.1` to specify the type of bump.

i.e. `npm run bump -- major`
