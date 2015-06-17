var io = require('./io-promise.js');
var $ = require("whacko");

var Respec = {};

Respec.fetch = function (url) {
  return io.fetch(url).then(function (response) {
    return response.text();
  }).then (function (data) {
    return $.load(data);
  }).then(function (document) {
    var spec = {};
    spec.url = url;
    spec.title = document("title").text().trim();
    spec.abstract = document("section#abstract");
    spec.sections = [];
    document("body > section").each(function (i, elem) {
      var id = $(this).attr("id");
      var className = $(this).attr("class");
      // var h2 = $(this).selector("h2").text();
      if (id !== "abstract" && id !== "sotd") {
        if (className === "appendix") {
          var h2 = $(this).find("h2").text().trim();
          if (h2 === "Acknowledgments") {
            spec.acknowledgments = $(this);
          } else {
            console.log("%s : %s", spec.title, h2);
            spec.sections.push($(this));
          }
        } else {
          spec.sections.push($(this));
        }
      }
    });
    return spec;
  })
}

module.exports = Respec;
