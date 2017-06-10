$(document).ready(function() {
  var _sr = null;
  var start_recognize = function() {
    var sr = new webkitSpeechRecognition();
    sr.continuous = true;
    sr.interimResults = false;
    sr.lang = 'ja-JP';
    sr.onresult = function(e) {
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          var str = e.results[i][0].transcript;
          console.log('Recognized: ' + str);
          $("#text").text(str);
          start_recognize();
        }
      }
    };
    sr.onerror = function() {
      console.log("onerror");
      start_recognize();
    };
    sr.onsoundend = function() {
      console.log("onsoundend");
      start_recognize();
    };
    sr.start();
    _sr = sr;
  };

  var stop_recognize = function() {
    if (_sr !== null) _sr.stop();
  };

  $("#start-button").click(start_recognize);
  $("#stop-button").click(stop_recognize);
});
