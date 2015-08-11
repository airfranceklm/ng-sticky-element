'use strict';

describe('ng-sticky-element', function() {

  var element,
    rootScope,
    compile,
    timeout,
    global = jasmine.getGlobal();

  global.requestAnimationFrame = jasmine.createSpy('requestAnimationFrame');
  global.cancelAnimationFrame = jasmine.createSpy('cancelAnimationFrame');

  beforeEach(function() {
    module('afklStickyElement');
    inject(function($injector, _$rootScope_, _$compile_) {
      timeout = $injector.get('$timeout');
      rootScope = _$rootScope_;
      compile = _$compile_;

      element = compile('<div afkl-sticky-element></div>')(rootScope);
      rootScope.$digest();
    });
  });

  describe('afklStickyElement.directives', function() {

    it('should be initialized properly', function() {
      expect(element.hasClass('afkl-sticky-element')).toBeTruthy();
    });

    it('should start requesting animation frame', function() {
      timeout.flush();
      expect(global.requestAnimationFrame).toHaveBeenCalled();
    });

    it('should stop requesting animation frame on $destroy', function() {
      element.remove();
      expect(global.cancelAnimationFrame).toHaveBeenCalled();
    });
  });
});
