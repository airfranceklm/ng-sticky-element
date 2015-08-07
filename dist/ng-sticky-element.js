/**
 * ng-sticky-element v0.1.0 (https://github.com/afklm/ng-sticky-element)
 * Copyright 2015 - KLM Royal Dutch Airlines
 * Licensed under MIT
 */
'use strict';

(function (window, angular, undefined) {
  'use strict';

  var DEFAULT_CLASS = 'afkl-sticky-element';
  var STICKY_CLASS = 'afkl-sticky-element--sticky';
  var VISIBLE_CLASS = 'afkl-sticky-content--visible';

  var BOTTOM = 'bottom';
  var TOP = 'top';

  angular.module('afklStickyElement.directives', []).directive('afklStickyElement', ['$window', '$document', '$timeout', function ($window, $document, $timeout) {
    return {
      restrict: 'A',
      link: function link(scope, $element, attrs) {
        $element.addClass(DEFAULT_CLASS);

        var stickTo = attrs.afklStickyElement === BOTTOM ? BOTTOM : TOP;

        var requestID = null;
        var lastYOffset = null;
        var lastBodyHeight = null;
        var lastInnerWidth = null;
        var elPos = null;
        var body = $document[0].body;
        var element = $element[0];
        var offset = attrs.afklStickyElementOffset ? parseInt(attrs.afklStickyElementOffset) : 0;

        // wait first directives to be rendered,
        // so we can get proper position values:
        $timeout(function () {
          // make the element temporarily visible:
          $element.addClass(VISIBLE_CLASS);
          requestID = $window.requestAnimationFrame(updateState);
          $element.removeClass(VISIBLE_CLASS);
        }, 0);

        function updateState() {
          if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            requestID = $window.requestAnimationFrame(updateState);
            return;
          }

          if (lastYOffset !== $window.pageYOffset || lastBodyHeight !== body.offsetHeight || lastInnerWidth !== $window.innerWidth) {
            lastYOffset = $window.pageYOffset;
            lastBodyHeight = body.offsetHeight;
            lastInnerWidth = $window.innerWidth;

            // clear stickiness so we can get proper element position:
            clearStickiness();
            calculateElementPosition();

            if (isStickyState()) {
              addStickiness();
            }
          }

          requestID = $window.requestAnimationFrame(updateState);
        }

        function calculateElementPosition() {
          elPos = stickTo === TOP ? $window.pageYOffset + element.getBoundingClientRect().top : $window.pageYOffset + element.getBoundingClientRect().top + element.offsetHeight;

          return elPos;
        }

        function isStickyState() {
          return stickTo === TOP ? $window.pageYOffset > elPos - offset : $window.pageYOffset + $window.innerHeight < elPos + offset;
        }

        function clearStickiness() {
          $element.removeClass(STICKY_CLASS).css(stickTo, null);
        }

        function addStickiness() {
          $element.addClass(STICKY_CLASS).css(stickTo, offset + 'px');
        }

        $element.on('$destroy', function () {
          $window.cancelAnimationFrame(requestID);
        });
      }
    };
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('afklStickyElement', ['afklStickyElement.directives']);
})(window, window.angular);