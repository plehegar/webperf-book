var webperf_specs = require("./specs.json");
var respec = require('./respec.js');
var io = require("./io-promise.js");
// var $ = require("whacko");

var resources_fetched = webperf_specs.length + 1;

var spec_texts = [];
var number_of_notify = 0;
function notify(text, index) {
//  console.log("notify('', %d)", index);
  spec_texts[index] = text;
  number_of_notify++;
  if (number_of_notify === resources_fetched) {
    end();
  }
}

var spec_acknowledgments = [];
function notifyAck(text, index) {
//  console.log("notifyAck('', %d)", index);
  spec_acknowledgments[index] = text;
}

webperf_specs.forEach(function (url, idx) {
  respec.fetch(url).then(function (spec) {
    var text = "";
    text += "<section>";
    text += "<h2>" + spec.title + "</h2>";
    text += spec.abstract.html();
    if (spec.acknowledgments !== undefined) {
      notifyAck(spec.acknowledgments.html(), idx);
    }
    spec.sections.forEach(function (section) {
      var id = section.attr("class");
      var htmlClass = section.attr("class");
      text+= "<section";
      if (id !== undefined) text += " id='" + id +"'";
      if (htmlClass !== undefined) text += " class='" + htmlClass + "'";
      text += ">";
      text += section.html();
      text += "</section>";
    });
    text += "</section>";
    return text;
  }).then(function (text) {
    notify(text, idx+1);
  }).catch(function (err) {
    console.log(err);
    console.log(err.stack);
  });
});

io.read("start.html").then(function (data) {
  notify(data, 0);
});

function end() {
  var whole = "";
  spec_texts.forEach(function (text) {
    whole += text;
  });

  whole += "<section class='appendix'><h2>Acknowledgments</h2>";
  spec_acknowledgments.forEach(function (text) {
    whole += text;
  });
  whole += "</section>";
  whole += "</body></html>";
  io.save("index.html", whole);
}
