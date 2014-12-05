# Contributing

Like most open source projects, we ask that you fork the project and issue a [pull request](#pull-requests) with your changes.

We encourage small change pull requests, the smaller the change the quicker and easier it is merged.

## Dependencies

To build the Gulp Sky Component Helper locally, you'll need to install:
 * [node.js](http://nodejs.org),
 * [Gulp](http://gulpjs.com),


## Workflow

1. Fork the project
2. Clone down your fork
`git clone git://github.com/<username>/gulp-sky-component-helper.git`
3. Setup your 'upstream'
`git remote add upstream https://github.com/skyglobal/gulp-sky-component-helper.git`
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

 * `gulp serve` :  Run server on port 3456
 
## Releasing (admin only)

 * Update [package.json](package.json) version number appropriately
 * `gulp release:gh-pages` : push the latest version to gh-pages
 * `gulp release:bower` : release the code to bower
 * `gulp release:cdn` : push the latest version to Akamai