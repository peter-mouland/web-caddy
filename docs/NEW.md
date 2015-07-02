# Caddy New

 * [Creating A New Project](#creating-a-new-project)

#### Creating A New Project

> To create a new project with a build process, tdd and continuous deployment already set-up

For this to work you must have caddy installed globally (i.e. `npm i -g web-caddy`)

 * CLI: `caddy new *project-name*`

**Generated Directory Structure**

    $ project
    ├── examples        => source code to demo the project
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
