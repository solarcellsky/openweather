chrome.app.runtime.onLaunched.addListener(function() {
  chrome.app.window.create('app.html', {
    'bounds': {
      'width': 730,
      'height': 500
    }
  });
});