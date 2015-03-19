# Initialising

 * [Bower](#bower)
 * [gh-pages (github.io)](#gh-pages-github.io)
 * [Remote Git Repository)](#remote-git-repository)

#### Bower

> Putting your code into Bowers registry so that other can `bower install`

Ensure you have a [bower.json](https://github.com/bower/bower.json-spec) with the correct `name` and that the `repository` is up to date within your [package.json](https://docs.npmjs.com/files/package.json).

`component init bower`

You only need to complete this step once.
Bower will then be updated every time you tag your code in git.
Both of the other release process include git-tagging.

For any other bower questions, i.e. to unregister your repository etc see [bower.io](http://bower.io/).

#### gh-pages (github.io)

> Put an existing project onto github.io

`component init gh-pages`

This will create a gh-pages branch locally and send a test file remotely.

See [#deploying-to-github.io](#deploying-to-github.io) for next steps.

#### Remote Git Repository

> Initialise a remote Git repository for the first time

`component init git`

This will add files from within the current directory, commit and push them to the provided git repo.
