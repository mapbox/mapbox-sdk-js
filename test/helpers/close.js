var test = require('tap').test;

test('close', function(t) {
  t.end();
  setTimeout(function() {
    window.close();
  }, 500);
});
