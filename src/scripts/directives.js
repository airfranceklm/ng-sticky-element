(function(window, angular, undefined) {
  'use strict';

  var DEFAULT_CLASS = 'afkl-sticky-element';
  var STICKY_CLASS = 'afkl-sticky-element--sticky';
  var VISIBLE_CLASS = 'afkl-sticky-content--visible';

  var BOTTOM = 'bottom';
  var TOP = 'top';

  angular
    .module('afklStickyElement.directives', [])
    .directive('afklStickyElement', ['$window', '$timeout',
      function($window, $timeout) {
        return {
          restrict: 'A',
          link: function(scope, element, attrs) {
            element.addClass(DEFAULT_CLASS);

            var stickTo = attrs.afklStickyElement === BOTTOM ?
              BOTTOM : TOP;

            var elPos = null;
            var domEl = element[0];
            var offset = attrs.afklStickyElementOffset ?
              parseInt(attrs.afklStickyElementOffset) : 0;
            var $win = angular.element($window);

            $win.on('scroll', updateState);

            // wait first directives to be rendered,
            // so we can get proper position values:
            $timeout(function() {
              // make the element temporarily visible:
              element.addClass(VISIBLE_CLASS);
              updateState();
              element.removeClass(VISIBLE_CLASS);
            }, 0);

            function updateState() {
              // no visibility, no pain:
              if (domEl.offsetWidth === 0 && domEl.offsetHeight === 0) {
                return;
              }

              // first of all clear stickiness,
              // so we can get proper element position:
              clearStickiness();
              calculateElementPosition();

              if (isStickyState()) {
                addStickiness();
              }
            }

            function calculateElementPosition() {
              elPos = stickTo === TOP ?
                $window.pageYOffset + domEl.getBoundingClientRect().top :
                $window.pageYOffset + domEl.getBoundingClientRect().top + domEl.offsetHeight;

              return elPos;
            }

            function isStickyState() {
              return stickTo === TOP ?
                $window.pageYOffset > elPos - offset :
                $window.pageYOffset + $window.innerHeight < elPos + offset;
            }

            function clearStickiness() {
              element
                .removeClass(STICKY_CLASS)
                .css(stickTo, null);
            }

            function addStickiness() {
              element
                .addClass(STICKY_CLASS)
                .css(stickTo, offset + 'px');
            }

            scope.$on('$destroy', function() {
              $win.off('scroll', updateState);
            });
          }
        };
      }
    ]);

})(window, window.angular);
