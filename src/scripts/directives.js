(function(window, angular, undefined) {
  'use strict';

  var DEFAULT_CLASS = 'afkl-sticky-element';
  var STICKY_CLASS = 'afkl-sticky-element--sticky';

  angular
    .module('afklStickyElement.directives', [])
    .directive('afklStickyElement', [
      function() {
        return {
          restrict: 'A',
          scope: {},
          link: function(scope, element) {
            element.addClass(DEFAULT_CLASS);


          }
        };
      }
    ]);

})(window, window.angular);
