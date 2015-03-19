# Release Process

There are a number of use cases for release:

 * [Continuous deployment](#continuous-deployment)
 * [Manual deployment](#manual-deployment)
 * [Deploying to Bower](#deploying-to-bower)
 * [Deploying to Amazon S3](#deploying-to-amazon-s3)
 * [Deploying to github.io](#deploying-to-github.io)
 * [Bump](#bump-the-version)

For many more command options please see the [API.md#releasing](API.md#releasing)

## Continuous Deployment

> This method relies on the version number being incremented manually before code is pushed to Git.

 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * Merge your changes into master
 * `npm test` : Run the tests again
 * `component bump` : See [bump-the-version](#bump-the-version) for options.
 * `git push` : to kick of the deploy process

CircleCI will then run your tests, and if successful:
 * Tag the version number and push to Git
 * Push the demo `site` to github.io
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
      - ./node_modules/component-helper/bin/component release current
machine:
  node:
    version: v0.10.33
```

## Manual Deployment

> This method relies on the tests being run locally.

`component release`

   * This will automatically bump the version number (using [bump-the-version](#bump-the-version)).
   * Tag the version number and push to Git
   * Push the demo `site` to github.io
   * Push the compiled assets to the S3 (if configured)

It is recommended you update your package.json `scripts` object to automatically run tests first (see [TESTING.md](TESTING.md)):

```javascript
  "release": "npm test && component release"
```

You can then run `npm run release` for simple patch releases. Feel free to setup shortcuts for any other release types.

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

This happens automatically with every git tag, if you have initialised bower first.

See [INITIALISING.md#bower](INITIALISING.md#bower).

## Deploying to S3

> If the deployment timed out at the last step, you can redeploy to the s3 in isolation

`component release s3`

This will push the current files from within `_site` to S3 using the options within [component.config.js](boilerplate/component.config.js).
Setting this option to false will prevent a release.

**Example 1: Using Environment Variables**
```javascript
    ...
    release: 's3',
    s3: {
        bucket: process.env.YOUR_AWS_BUCKET,
        region: process.env.YOUR_AWS_REGION,
        accessKey: process.env.YOUR_AWS_ACCESS_KEY_ID,
        secret: process.env.YOUR_AWS_SECRET_ACCESS_KEY,
        directoryPrefix: 'components/'
    },
```

**Example 2: Using AWS Credentials**
```javascript
    ...
    release: 's3',
    s3: {
        bucket: process.env.YOUR_AWS_BUCKET,
        region: process.env.YOUR_AWS_REGION,
        profile: pkg.name,
        directoryPrefix: false
    },
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

`component release gh-pages`

This will push the current files within `_site` to gh-pages branch (making your demo available on github.io).


## Bump the Version

> Bump the version within your app

`component bump`

This will update the version number in all the docs (package.json, version.js, *.md and *.html).

By default, this applies a  `patch`.  Add either `patch`, `minor`, `major`, `prerelease` or even `v3.2.1` to specify the type of bump.

i.e. `component bump major`
