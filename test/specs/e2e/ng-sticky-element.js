describe('ng-sticky-element', function() {

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/demo/index.html');
  });

  it('should initialize properly', function() {
    var moduleElement = element.all(by.className('afkl-sticky-element'));
    expect(moduleElement.count()).toEqual(2);
  });
});
