'use strict';

angular
  .module('demoApp', [
    'afklStickyElement'
  ])
  .controller('demoMainController', [
      '$scope', '$window', '$document', '$timeout',
    function($scope, $window, $document, $timeout) {
      $scope.contentHeight = 1000;
      $scope.increaseContentHeight = function() {
        $scope.isScrolledToBottom && ($scope.contentHeight += 100) && checkScrollPos();
      };

      $scope.isScrolledToBottom = false;
      checkScrollPos();
      angular.element($window).on('scroll', checkScrollPos);

      var scrollTimer = null;
      function checkScrollPos() {
        $timeout.cancel(scrollTimer);
          scrollTimer = $timeout(function() {
          $scope.isScrolledToBottom =
            $window.innerHeight + $window.pageYOffset >= $document[0].body.offsetHeight;
          $scope.$apply();
        }, 100);
      }
    }
  ]);
