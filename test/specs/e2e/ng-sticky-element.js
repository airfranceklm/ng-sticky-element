describe('ng-sticky-element', function() {
  var moduleElements;

  var STICKY_CLASS = 'afkl-sticky-element--sticky';

  beforeEach(function() {
    browser.get('http://127.0.0.1:8080/demo/index.html');
    browser.manage().window().setSize(1200, 640);

    moduleElements = element.all(by.className('afkl-sticky-element'));
  });

  it('should initialize properly', function() {
    expect(moduleElements.count()).toEqual(2);
  });

  it('should handle sticky-mode properly', function() {
    // bottom element should be already in sticky-mode:
    var stickyElements = element.all(by.className(STICKY_CLASS));
    expect(stickyElements.count()).toEqual(1);

    browser.executeScript('window.scrollTo(0, 300);').then(function() {
      stickyElements = element.all(by.className(STICKY_CLASS));
      expect(stickyElements.count()).toEqual(2);
    });

    browser.executeScript('window.scrollTo(0, 1000);').then(function() {
      stickyElements = element.all(by.className(STICKY_CLASS));
      // only the top element remains sticky:
      expect(stickyElements.count()).toEqual(1);
    });
  });

  it('should respect to offset parameter', function() {
    var topStickyElement = moduleElements.get(0);

    topStickyElement.getLocation().then(function (pos) {
      topStickyElement.getAttribute('afkl-sticky-element-offset').then(function(offset) {
        var stickyStartPos = pos.y - parseInt(offset);

        browser.executeScript('window.scrollTo(0, ' + stickyStartPos + ');')
          .then(function() {
            expect(topStickyElement.getAttribute('class')).not.toContain(STICKY_CLASS);

            browser.executeScript('window.scrollTo(0, ' + (stickyStartPos + 1) + ');')
              .then(function() {
                expect(topStickyElement.getAttribute('class')).toContain(STICKY_CLASS);
              });
          });
      });
    });
  });

  it('should respect to given media query', function() {
    browser.executeScript('window.scrollTo(0, 300);').then(function() {
      browser.manage().window().setSize(630, 640).then(function() {
        expect(moduleElements.get(0).getAttribute('class')).not.toContain(STICKY_CLASS);
      });
    });
  });

  it('should respond to content changes', function() {
    // scroll to bottom, so that only the top element will be on sticky mode:
    browser.executeScript('window.scrollTo(0, 1000);').then(function() {
      // extend the content area:
      element(by.css('[ng-click="increaseContentHeight()"]')).click().then(function() {
        stickyElements = element.all(by.className(STICKY_CLASS));
        expect(stickyElements.count()).toEqual(2);
      });
    });
  });
});
