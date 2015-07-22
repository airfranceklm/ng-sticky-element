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

  angular.module('afklStickyElement.directives', []).directive('afklStickyElement', [function () {
    return {
      restrict: 'A',
      scope: {},
      link: function link(scope, element) {
        element.addClass(DEFAULT_CLASS);
      }
    };
  }]);
})(window, window.angular);
'use strict';

(function (window, angular, undefined) {
  'use strict';

  angular.module('afklStickyElement', ['afklStickyElement.directives']);
})(window, window.angular);