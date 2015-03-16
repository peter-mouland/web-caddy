# Release Process

## Continuous Deployment

> This method relies on the version number being incremented manually before code is pushed to Git.

 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, rebase from master.
 * Merge your changes into master
 * `npm test` : Run the tests again
 * `component bump` : Bump the version number (see [api](https://github.com/skyglobal/component-helper/blob/master/API.md#bump-the-version) for options)
 * `git push` : to kick of the deploy process
 * CircleCI will then run your test, tag the new release within git and deploy.

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

`npm test && component release`

   * This will run your tests, if they fail the release will stop.
   * It bumps the version number (`patch` by default, see [api](https://github.com/skyglobal/component-helper/blob/master/API.md#bump-the-version) for options)
   * Tag the version number and push to Git
   * Push the demo `site` to github.io
   * Push the compiled assets to the S3 (if configured)

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

## Bower

Bower will be updated every time github has a new tag.  Ensure bower has been initiated:

`component init bower`

## Releasing API

For many more command options please see the [Component helper API](https://github.com/skyglobal/component-helper/blob/master/API.md#releasing)