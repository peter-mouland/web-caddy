# Release Process

## Continuous Deployment

> This method relies on the version number being incremented manually before code is pushed to Git.

 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * merge your changes into master
 * bump the version number manually
   * `npm run bump` or see [api](https://github.com/skyglobal/component-helper/blob/master/API.md#bump-the-version)

Your `circle.yml` should look something like:

```yml
test:
  pre:
    - bower i
  post:
    - git config --global user.name "circleci"
    - git config --global user.email "{{ git.email }}"
deployment:
  production:
    branch: master
    commands:
      - ./node_modules/component-helper/bin/component release --version=current
machine:
  node:
    version: v0.10.33
```

## Manual Deployment

> This method relies on the tests being run locally.

`npm test && component release`

   * This will run your tests, if they fail the release will stop.
   * Bump the version number (`patch` by default)
     * You could specify how to bump by appending ` --version=` along with `major`, `minor`, `patch` or `prerelease`.
   * Tag the version number and push to Git
   * Push the demo `site` to github.io
   * Push the compiled assets to the S3 (if configured)

Your `circle.yml` should look something like:

```yml
test:
  pre:
    - npm i && bower i
machine:
  node:
    version: v0.10.33
```

## Bower

`component init bower`

To release to Bower please ensure your `component.config.js` includes the `bower.json` object.

## Releasing API

For many more command options please see the [Component helper API](https://github.com/skyglobal/component-helper/blob/master/API.md#releasing)