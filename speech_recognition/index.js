$(document).ready(function() {
  var _sr = null;
  var _result = null;
  var _status = null;
  function start_recognize(lang) {
    var sr = new webkitSpeechRecognition();
    sr.continuous = true;
    sr.interimResults = false;
    sr.lang = lang || 'ja-JP';
    sr.onresult = function(e) {
      for (var i = e.resultIndex; i < e.results.length; ++i) {
        if (e.results[i].isFinal) {
          _result = e.results[i];
          var str = e.results[i][0].transcript;
          console.log('Recognized: ' + str);
          $("#result").text(str);
          start_recognize();
        }
      }
    };
    sr.onnomatch = function() {
      console.log("onnomatch");
      _status = "nomatch";
    }
    sr.onerror = function(e) {
      var err = "onerror: " + e.message;
      console.log(err);
      _status = err;
      // start_recognize();
    };
    sr.onsoundstart = function() {
      console.log("onsoundstart");
      _status = "onsoundstart";
    };
    sr.onsoundend = function() {
      console.log("onsoundend");
      _status = "onsoundend";
      //      start_recognize();
    };
    sr.start();
    _sr = sr;
  };

  function stop_recognize() {
    if (_sr !== null) _sr.stop();
  };

  function get_status() {
    return _status;
  };

  $("#start-button").click(start_recognize);
  $("#stop-button").click(stop_recognize);
});
