'use strict';

describe('ng-sticky-element', function() {

  beforeEach(module('afklStickyElement'));

  var element,
    rootScope,
    compile;

  describe('afklStickyElement.directives', function() {

    beforeEach(function() {
      inject(function(_$rootScope_, _$compile_) {
        rootScope = _$rootScope_;
        compile = _$compile_;

        element = compile('<div afkl-sticky-element></div>')(rootScope);
        rootScope.$digest();
      });
    });

    it('should be initialised properly', function() {
      expect(element.hasClass('afkl-sticky-element')).toBeTruthy();
    });
  });
});
