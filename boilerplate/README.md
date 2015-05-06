[{{ project.toWord }}]({{ git.io-URL }})  [![Circle CI](https://circleci.com/gh/{{ git.username }}/{{ project }}/tree/master.svg?style=svg)](https://circleci.com/gh/{{ git.username }}/{{ project }}/tree/master)
========================

> Please take a look at the [demo page]({{ git.io-URL }})

## Quick-Start

Include the {{ project.toWord }} assets in your project either as **Static Resources**

```html
<link rel="stylesheet" href="http:// WEB ADDRESS /{{ project }}/0.0.1/styles/{{ project }}.min.css" />
<script type="text/javascript" src="http:// WEB ADDRESS /{{ project }}/0.0.1/scripts/{{ project }}.min.js"></script>
```

or alternatively, **Via Bower**

 * Run: `bower install --save-dev {{ project }}`
 * Include Sass: `@import 'bower_components/{{ project }}/src/styles/{{ project }}';`
 * Include JS: `var {{ project }} = require('../../bower_components/{{ project }}/src/scripts/{{ project }}');`


#### Dependencies

This component relies on other components and you must also include these in your project.

 * [Dependency Name](https://github.com/DependencyName)

#### Developer Notes

Choose a type of {{ project.toWord }} component and copy the relevant html.
 * [example](demo/_includes/example.html)
 * [example](demo/_includes/example.html),

## Contribution

Components depends on collaboration between developers. Contributions of any size are actively encouraged.

To see how to build this component locally, read the [contribution guidelines](CONTRIBUTING.md).

## Browser Support

(To support IE8 please add [ployfill](https://github.com/skyglobal/polyfill) to your site)

 * IE9 +
 * Safari 7 +
 * Latest Firefox
 * Latest Chrome
 * Latest Mobile Safari
 * Latest Mobile Chrome
