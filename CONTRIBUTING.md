# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](#pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the Component Helper locally, you'll need to install:
 * [node.js](http://nodejs.org),
 * [Gulp](http://gulpjs.com),

## Workflow

1. Fork the project
2. `git clone your-repo` the fork
3. Setup your 'upstream'
`git remote add upstream https://github.com/peter-mouland/web-caddy.git`
4. Run npm install `npm install`
5. Create a topic branch to contain your change
`git checkout -b my-feature`
6. Hack, hack, hack
7. Make sure [CHANGELOG.md](./CHANGELOG.md) includes a summary of your changes in a new version number heading
8. Make sure you are still up to date with master
`git pull upstream master`
9. If necessary, rebase your commits into logical chunks, without errors.
10. Push the branch up
`git push origin my-feature`
11. Create a pull request and describe what your change does and the why you think it should be merged.

## Running web-caddy Locally

 * `npm test`

If you want to upgrade or test an existing component locally, you can link the component to `web-caddy`.
Any changes made to the web-caddy will be picked up by the component. Useful for modifying the tasks.

 * `cd web-caddy`
 * `npm link`
 * `cd some-component`
 * `npm link web-caddy`

## Releasing web-caddy (admin only)

 * Update [package.json](package.json) and [examples/package.json](examples/package.json) version number appropriately
 * `npm adduser` (first time only)
 * `npm dedupe`
 * `npm shrinkwrap`
 * `npm pack && tar -tf *.tgz && rm *.tgz` : Check the files in your package (especially index.js!)
 * `npm publish` : (needs npm v2.1.0+) https://www.npmjs.org/package/npm-release
