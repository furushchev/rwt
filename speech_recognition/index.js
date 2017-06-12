var Queue = function(capacity) {
  if (!(this instanceof Queue)) {
    return Queue(num);
  }

  this.q = new Array();
  this.capacity = capacity || 10;
};

Queue.prototype.push = function(e) {
  if (this.size() == this.capacity) {
    this.pop();
  };
  this.q.push(e);
};

Queue.prototype.pop = function() {
  if (this.size() > 0) {
    return this.q.shift();
  } else return null;
};

Queue.prototype.size = function() {
  return this.q.length;
};

Queue.prototype.toString = function() {
  return '[' + this.q.join(', ') + ']';
};

Queue.prototype.map = function(f) {
  return this.q.map(f);
};


var SpeechRecognition = function(lang) {
  if (!(this instanceof SpeechRecognition)) {
    return new SpeechRecognition(lang);
  }

  var SR = window.webkitSpeechRecognition
        || window.mozSpeechRecognition
        || window.oSpeechRecognition
        || window.msSpeechRecognition;
  if (SR === null) {
    console.log("Speech Recognition is not available");
    return null;
  }

  var sr = new SR();
  sr.continuous = true;
  sr.interimResults = false;
  sr.lang = lang || 'ja-JP';

  this.result = new Queue();
  this.status = new Queue();
  this.onChangeStatus = null;
  this.onResult = null;

  var that = this;

  var now = function() { return new Date().getTime(); };

  var notifyStatusChange = function(name, detail) {
    var status = {name: name,
                  stamp: now(),
                  detail: detail};
    that.status.push(status);
    if (that.onChangeStatus !== null) {
      that.onChangeStatus(that.status);
    }
  };

  var defaultHandler = function(name) {
    return function() {
      console.log(name);
      notifyStatusChange(name);
    };
  };

  sr.onresult = function(e) {
    for (var i = e.resultIndex; i < e.results.length; ++i) {
      if (e.results[i].isFinal) {
        var res = e.results[i];
        var str = res[0].transcript;
        var d = {};
        for (var j = 0; j < res.length; ++j) {
          d[res[i].transcript] = res[i].confidence;
        }
        console.log("onresult: " + JSON.stringify(d) + str);
        that.result = res;
        notifyStatusChange("onresult", JSON.stringify(d));
        if (that.onResult !== null) {
          that.onResult(res);
        }
        sr.stop();
        setTimeout(function() {
          sr.start();
        }, 200);
      }
    }
  };

  sr.onerror = function(e) {
    console.log("onerror: " + e.error);
    notifyStatusChange("onerror", e.error);
    if (e.error !== "no-speech") {
      sr.stop();
      setTimeout(function() {
        sr.start();
      }, 200);
    }
  };

  sr.onaudioend = function() {
    console.log("onaudioend");
    notifyStatusChange("onaudioend");
    sr.stop();
    setTimeout(function() {
      sr.start();
    }, 200);
  };

  sr.onnomatch = defaultHandler("onnomatch");
  sr.onspeechstart = defaultHandler("onspeechstart");
  sr.onspeechend = defaultHandler("onspeechend");
  sr.onsoundstart = defaultHandler("onsoundstart");
  sr.onsoundend = defaultHandler("onsoundend");
  this.recog = sr;
};

SpeechRecognition.prototype.start = function() {
  this.recog.start();
};

SpeechRecognition.prototype.stop = function() {
  this.recog.stop();
};

SpeechRecognition.prototype.get_status = function() {
  return this.status;
};

SpeechRecognition.prototype.get_result = function() {
  return this.result;
};

$(function() {
  var sr = new SpeechRecognition();
  sr.onChangeStatus = function(s) {
    var delim = "|";
    var txt = s.map(function(e) {
      return "" + e.stamp + "|" + e.name + "|" + (e.detail || "");
    }).join('<br>');

    $("#status").html(txt);
  };
  sr.onResult = function(e) {
    $("#result").html("Result: " + e[0].transcript + "<br>");
  };
  $("#start-button").click(function() {sr.start();});
  $("#stop-button").click(function() {sr.stop();});
});
