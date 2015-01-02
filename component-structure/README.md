[{{ component }}](http://{{ git.user }}.github.io/{{ component }}/)  [![Circle CI](https://circleci.com/gh/skyglobal/{{ component }}/tree/master.svg?style=svg)](https://circleci.com/gh/skyglobal/{{ component }}/tree/master)
========================

> Please take a look at the [demo page](http://skyglobal.github.io/{{ component }}/)


## Quick-Start

Include the Share assets in your project either as **Static Resources**

```
<link rel="stylesheet" href="http://web-toolkit.global.sky.com/components/{{ component }}/0.0.1/css/{{ component }}.css" />
<script type="text/javascript" src="http://web-toolkit.global.sky.com/components/{{ component }}/0.0.1/js/{{ component }}.min.js"></script>

or alternatively, **Via Bower**

 * Run: `bower install --save-dev bskyb-{{ component }}`
 * Include Sass: `@import 'bower_components/bskyb-{{ component }}/src/scss/{{ component }}';`
 * Include JS: `var share = require('../../bower_components/bskyb-{{ component }}/src/js/{{ component }}');`


#### Dependencies

This component relies on other components and you must also include these in your project.

 * [Dependency Name](https://github.com/skyglobal/DependencyName)

#### Developer Notes

Choose a type of {{ component }} component and copy the relevant html.
 * [example](demo/_includes/example.html)
 * [example](demo/_includes/example.html),

#### Initialise

To enable --descrition here--, the JS must be initialised:

```
<script type="text/javascript">
  skyComponents.{{ component }}.init();
</script>
```

## Contribution

Components depends on collaboration between developers. Contributions of any size are actively encouraged.

[Read More >](CONTRIBUTING.md)

## Browser Support

 * IE8 +
 * Safari 5 +
 * Latest Firefox
 * Latest Chrome
 * Latest Mobile Safari
 * Latest Mobile Chrome