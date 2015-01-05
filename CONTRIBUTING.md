# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](#pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the Gulp Component Helper locally, you'll need to install:
 * [node.js](http://nodejs.org),
 * [Gulp](http://gulpjs.com),


## Workflow

1. Fork the project
2. Clone down your fork
`git clone git://github.com/skyglobal/gulp-component-helper.git`
3. Setup your 'upstream'
`git remote add upstream https://github.com/skyglobal/gulp-component-helper.git`
4. Create a topic branch to contain your change
`git checkout -b feature-my-feature`
5. Make sure [CHANGELOG.md](./CHANGELOG.md) includes a summary of your changes in a new version number heading
6. Make sure you are still up to date with master
`git pull upstream master`
7. If necessary, rebase your commits into logical chunks, without errors.
8. Push the branch up
`git push origin my-awesome-feature`
9. Create a pull request and describe what your change does and the why you think it should be merged.

## Running Locally

There is a test directory where your changes can be tried out.
All Git/Upload tasks are currently mocked to prevent accidental commits.

 * `cd test`
 * `gulp init:component`
 * `gulp ...`

If you want to upgrade or test an existing component locally, you can link the component to `gulp-component-helper`.
Any changes made to the gulp-component-helper will be picked up by the component. Useful for modifying the gulp tasks.

 * `cd gulp-component-helper`
 * `npm link`
 * `cd some-component`
 * `npm link gulp-component-helper`

## Releasing (admin only)

 * Update [package.json](package.json) and [examples/package.json](examples/package.json) version number appropriately
 * `npm adduser` (first time only)
 * `npm pack && tar -tf gulp-component-helper-*.tgz` : Check the files in your package (especially index.js!)
 * `npm publish` : (needs npm v2.1.0+) https://www.npmjs.org/package/npm-release
