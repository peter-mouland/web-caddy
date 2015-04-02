# Initialising

 * [Creating A New Project](#creating-a-new-project)
 * [Register With Bower](#register-with-bower)
 * [Create A github.io/*your-project*)](#create-a-github.io)
 * [Add A Remote Git Repository)](#remote-git-repository)

#### Creating A New Project

> To create a new project with a build process, tdd and continuous deployment already set-up

`caddy new *project-name*`

**Generated Directory Structure**

    $ project
    ├── demo            => source code to demo the project
    │   ├- _includes
    │   ├- images
    │   ├- scripts
    │   ├- styles
    │   └- index.html
    ├── src             => source code for the project.
    │   ├- scripts
    │   └- styles
    ├── test            => Test config and specs
    │   ├- functional
    │   └- unit
    ├── circle.yml
    └── caddy.config.js       => The config

#### Register With Bower

> Putting your code into Bowers registry so that other can `bower install`

Ensure you have a [bower.json](https://github.com/bower/bower.json-spec) with the correct `name` and that the `repository` is up to date within your [package.json](https://docs.npmjs.com/files/package.json).

`caddy init bower`

You only need to complete this step once.
Bower will then be updated every time you tag your code in git.
Both of the other release process include git-tagging.

For any other bower questions, i.e. to unregister your repository etc see [bower.io](http://bower.io/).

#### Create A github.io

> Put an existing project onto github.io

`caddy init gh-pages`

This will create a gh-pages branch locally and send a test file remotely.

See [#deploying-to-github.io](#deploying-to-github.io) for next steps.

#### Remote Git Repository

> Initialise a remote Git repository for the first time

`caddy init git`

This will add files from within the current directory, commit and push them to the provided git repo.
