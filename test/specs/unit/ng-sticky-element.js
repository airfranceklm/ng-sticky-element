'use strict';

describe('ng-sticky-element', function() {

  var element,
    rootScope,
    compile,
    timeout,
    global = jasmine.getGlobal();

  global.setInterval = jasmine.createSpy('setInterval');
  global.clearInterval = jasmine.createSpy('clearInterval');

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

    it('should start polling content height', function() {
      timeout.flush();
      expect(global.setInterval).toHaveBeenCalled();
    });

    it('should stop polling content height on $destroy', function() {
      element.remove();
      expect(global.clearInterval).toHaveBeenCalled();
    });
  });
});
