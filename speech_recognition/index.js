$(document).ready(function() {
  var get_recognizer = function() {
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
    return sr;
  };

  var _sr = null;

  $("#start-button").click(function() {
    _sr = get_recognizer();
    _sr.start();
  });
  $("#stop-button").click(function() {
    if (_sr !== null) _sr.stop();
  });
});
