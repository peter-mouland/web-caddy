# Continuous Deployment

> This relies on the version number being incremented manually before code is pushed to Git.

**Submitting a PR**
 * Ensure all changes are made and pushed to feature branches
 * Once the feature/bug-fix is complete, [rebase from master](http://git-scm.com/book/ch3-6.html#The-Basic-Rebase).
 * `npm test` : Run the tests

**Accepting a PR**
 * Switch to the PR branch and review code
 * `npm test` : Run the tests
 * Merge the PR into master
 * `npm test` : Run the tests again
 * `npm run report` :  take a look at the code coverage report
 * `npm run bump` : [See BUMP.md for more info >](BUMP.md).
 * `git push` : to kick of the deploy process

CircleCI will then run your tests, and if successful:
 * Tag the version number and push to Git
 * Push the demo `site` to github.io (if configured)
 * Push the compiled assets to the S3 (if configured)

Your `circle.yml` should look something like:

```yml
test:
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
      - ./node_modules/web-caddy/bin/caddy release
machine:
  node:
    version: v0.10.33
```
