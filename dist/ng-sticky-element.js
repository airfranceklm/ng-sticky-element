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
        var body = $document[0].body;
        var lastBodyHeight = body.offsetHeight;
        var lastYOffset = $window.pageYOffset;
        var lastInnerWidth = $window.innerWidth;
        var elPos = null;
        var isOnStickyMode = false;
        var element = $element[0];
        var $win = angular.element($window);
        var mediaQuery = attrs.afklStickyElementMq;
        var offset = attrs.afklStickyElementOffset ? parseInt(attrs.afklStickyElementOffset) : 0;

        $win.bind('blur', stopPollingContentHeight);
        $win.bind('focus', startPollingContentHeight);
        $win.bind('scroll', checkWindowAndUpdateState);
        $win.bind('resize', checkWindowAndUpdateState);

        // wait first directives to be rendered,
        // so we can get proper position values:
        $timeout(function () {
          // make the element temporarily visible:
          $element.addClass(VISIBLE_CLASS);
          updateState();
          $element.removeClass(VISIBLE_CLASS);

          startPollingContentHeight();
        }, 0);

        function startPollingContentHeight() {
          if (lastBodyHeight !== body.offsetHeight) {
            lastBodyHeight = body.offsetHeight;
            updateState();
          }

          requestID = $window.requestAnimationFrame(startPollingContentHeight);
        }

        function checkWindowAndUpdateState() {
          if (element.offsetWidth === 0 || element.offsetHeight === 0) {
            return;
          }

          if (mediaQuery && !$window.matchMedia(mediaQuery).matches) {
            clearStickiness();
            return;
          }

          if (lastYOffset !== $window.pageYOffset || lastInnerWidth !== $window.innerWidth) {
            lastYOffset = $window.pageYOffset;
            lastInnerWidth = $window.innerWidth;
            updateState();
          }
        }

        function updateState() {
          clearStickiness();
          calculateElementPosition();

          if (isStickyState()) {
            addStickiness();
          }
        }

        function calculateElementPosition() {
          elPos = stickTo === TOP ? $window.pageYOffset + element.getBoundingClientRect().top : $window.pageYOffset + element.getBoundingClientRect().top + element.offsetHeight;

          return elPos;
        }

        function isStickyState() {
          return stickTo === TOP ? $window.pageYOffset > elPos - offset : $window.pageYOffset + $window.innerHeight < elPos + offset;
        }

        function clearStickiness() {
          if (isOnStickyMode) {
            isOnStickyMode = false;
            $element.removeClass(STICKY_CLASS).css(stickTo, null);
          }
        }

        function addStickiness() {
          if (!isOnStickyMode) {
            isOnStickyMode = true;
            $element.addClass(STICKY_CLASS).css(stickTo, offset + 'px');
          }
        }

        function stopPollingContentHeight() {
          $window.cancelAnimationFrame(requestID);
        }

        $element.on('$destroy', function () {
          stopPollingContentHeight();
          $win.unbind('blur', stopPollingContentHeight);
          $win.unbind('focus', startPollingContentHeight);
          $win.unbind('scroll', checkWindowAndUpdateState);
          $win.unbind('resize', checkWindowAndUpdateState);
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