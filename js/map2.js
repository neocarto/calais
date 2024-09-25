var map = L.map("map", {
  zoom: 9,
  fullscreenControl: true,
  center: [50.9, 1.8],
});

map.options.minZoom = 8;
map.options.maxZoom = 14;

L.tileLayer("https://tile.openstreetmap.bzh/br/{z}/{x}/{y}.png", {
  attribution:
    '© <a href="http://osm.org/copyright">OpenStreetMap</a>, Nicolas Lambert & Maël Galisson, 2020',
}).addTo(map);

var points = omnivore.csv("../data/Calais 20240915.csv");
var markers;
var on_hold = [];

function attachPopups() {
  // Create popups.
  points.eachLayer(function (layer) {
    var props = layer.feature.properties;

    if (!props.name) {
      n = "Anonymous";
    } else {
      n = props.name;
    }
    if (!props.nationality) {
      nat = "(Nationality unknown)";
    } else {
      nat = "(" + props.nationality + " nationality)";
    }

    var dt = props.date;

    var y = dt.substr(0, 4);
    var m = dt.substr(4, 2);
    var d = dt.substr(6, 2);

    var M = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    var mydate = M[+m - 1] + " " + d + ", " + y;

    layer.bindPopup(
      "<table class='infotab'>" +
        "<tr><td width='30px'><img src='../img/photos/" +
        props.photo +
        "' width='80px'></img></td><td><b>" +
        n +
        "</b><br/>" +
        nat +
        "</td></tr>" +
        "<tr><td colspan=2 class='tbl1'>" +
        props.incident +
        "<br/>on " +
        mydate +
        "</td></tr>" +
        "<tr><td colspan=2 class='tbl2'>" +
        props.description_en +
        "</td></tr>" +
        "</table>"
    );
  });
}

points.on("ready", function () {
  markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 30,
  });

  markers.addLayer(points);
  map.addLayer(markers);
  points.eachLayer(attachPopups);
  let my_icon = L.Icon.extend({
    options: {
      iconUrl: "../img/reddot.png",
      iconSize: [13, 13],
    },
  });
  let lyrs = markers.getLayers();
  lyrs.forEach((l) => {
    l.setIcon(new my_icon());
  });

  // Others elements ---------------------------------------------------
  d3.select("#compteur").html(points.getLayers().length + " deaths");
});
// https://github.com/dwilhelm89/LeafletSlider

function resetAllPoints() {
  on_hold.forEach((elem) => {
    let id = elem._leaflet_id;
    points._layers[id] = elem;
  });
  on_hold = [];
}

function foo(year_min, year_max) {
  markers.clearLayers();
  resetAllPoints();
  Object.keys(points._layers).forEach((k) => {
    const year = +points._layers[k].feature.properties.date.slice(0, 4);
    if (!(year <= year_max && year >= year_min)) {
      on_hold.push(points._layers[k]);
      points._layers[k] = null;
      delete points._layers[k];
    }
  });
  markers.addLayer(points);
  map.addLayer(markers);
  points.eachLayer(attachPopups);
  let my_icon = L.Icon.extend({
    options: {
      iconUrl: "../img/reddot.png",
      iconSize: [13, 13],
    },
  });
  let lyrs = markers.getLayers();
  lyrs.forEach((l) => {
    l.setIcon(new my_icon());
  });
  d3.select("#compteur").html(points.getLayers().length + " deaths");
}

// Slider ---------------------------------------------------

$(function () {
  $("#slider-range").slider({
    range: true,
    min: 1999,
    max: 2023,
    values: [1999, 2023],
    slide: function (event, ui) {
      $("#amount").val("From " + ui.values[0] + " to " + ui.values[1]);
      foo(ui.values[0], ui.values[1]);
    },
  });
  $("#amount").val(
    "From " +
      $("#slider-range").slider("values", 0) +
      " to " +
      $("#slider-range").slider("values", 1)
  );
});

// Others elements ---------------------------------------------------
d3.select("#logo").html("<img src='../img/logo2.png' width='250px'></img>");
d3.select("#contrib").html(
  "<a href='mailto:mael.galisson@gmail.com?subject=[Migrants Calais]&cc=nicolas.lambert@cnrs.fr&body=Je contribue...'>[Contribute]</a>"
);

// https://github.com/dwilhelm89/LeafletSlider
