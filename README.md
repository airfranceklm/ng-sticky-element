# ng-sticky-element [![Build Status](https://travis-ci.org/afklm/ng-sticky-element.svg?branch=master)](https://travis-ci.org/afklm/ng-sticky-element)

Angular directive to make HTML elements sticky when scrolling.

[Demo](http://afklm.github.io/ng-sticky-element/)

## Usage

Install via [Bower](http://bower.io) or [NPM](http://www.npmjs.org):
```bash
bower install ng-sticky-element --production
# or
npm install ng-sticky-element --production
```

Include main files:
```html
<link rel="stylesheet" href="bower_components/ng-sticky-element/dist/ng-sticky-element.min.css">
<script src="bower_components/ng-sticky-element/dist/ng-sticky-element.min.js"></script>
```

Include ``afklStickyElement`` module as a dependency into your app:
```javascript
angular
  .module('yourApp', [
    'afklStickyElement'
  ]);
```

Place ``afkl-sticky-element`` attribute onto element:
```html
<div afkl-sticky-element>I am now sticky.</div>
<!-- with optional attributes:
  afkl-sticky-element="bottom"
  afkl-sticky-element-offset="24" // offset in px
  afkl-sticky-element-mq="(min-width: 640px)" // applies stickiness only if given media-query is true
-->
```
## Browser Support

All modern browsers & IE versions newer than 9 are supported. IE9 should also be fine in case you polyfill [``matchMedia``](https://developer.mozilla.org/en-US/docs/Web/API/Window/matchMedia).

## Development

1. Clone the repo or [download]().
2. ``npm install && bower install``
3. Setup E2E testing environment: ``npm install -g protractor && webdriver-manager update --standalone``
4. Make the selenium driver up: ``webdriver-manager start --standalone`` and run ``gulp build``
5. Run ``gulp watch``, navigate to [http://localhost:8080/demo/index.html](http://localhost:8080/demo/index.html) and play on **/src**
6. Make sure that tests are up and green: ``gulp test-unit`` or ``gulp test-e2e``

## License

MIT
