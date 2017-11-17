var map = L.map('map', {
    zoom: 9,
    fullscreenControl: true,
    center: [50.9, 1.8]
});


L.tileLayer('https://cartodb-basemaps-{s}.global.ssl.fastly.net/dark_all/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> ; Nicolas Lambert & Maël Galisson, 2017',
	subdomains: 'abcd',
	maxZoom: 19
}).addTo(map);


var points = omnivore.csv('data/Calais.csv');
var markers;
var on_hold = [];

function attachPopups() {
  // Create popups.
    points.eachLayer(function (layer) {
      var props = layer.feature.properties;

	if (!props.name) {n = "Anonyme"} else {n = props.name}
	if (!props.natioinality) {nat = "(Nationalité inconnue)"} else {nat = "(Nationalité " + props.nationality + ")"}

      layer.bindPopup(

	"<table class='infotab'>" +
  	"<tr><td width='30px'><img src='img/photos/" + props.photo + "' width='80px'></img></td><td><b>" + n + "</b><br/>" + nat + "</td></tr>" +
 	"<tr><td colspan=2 class='tbl1'>" + props.cause + "</td></tr>" +
 	"<tr><td colspan=2 class='tbl2'>" + props.description + "</td></tr>" +
	"</table>"
      );
    });
}


points.on('ready', function() {
  markers = L.markerClusterGroup({
    showCoverageOnHover: false,
    maxClusterRadius: 30,
  });

  markers.addLayer(points);
  map.addLayer(markers);
  points.eachLayer(attachPopups);
  let my_icon = L.Icon.extend({
    options: {
      iconUrl: "img/reddot.png",
      iconSize: [13,13]
    }
  });
  let lyrs = markers.getLayers();
  lyrs.forEach(l => { l.setIcon(new my_icon); });


// Others elements ---------------------------------------------------
d3.select('#compteur').html(points.getLayers().length +" morts")





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
    const year = +points._layers[k].feature.properties.date.slice(0,4);
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
      iconUrl: "img/reddot.png",
      iconSize: [13,13]
    }
  });
  let lyrs = markers.getLayers();
  lyrs.forEach(l => { l.setIcon(new my_icon); });
d3.select('#compteur').html(points.getLayers().length +" morts")

}


// Slider ---------------------------------------------------
 
$( function() {
    $( "#slider-range" ).slider({
      
      range: true,
      min: 1999,
      max: 2017,
      values: [ 1999, 2017 ],
      slide: function( event, ui ) {
        $( "#amount" ).val( "De " + ui.values[ 0 ] + " à " + ui.values[ 1 ] );
	foo(ui.values[ 0 ],ui.values[ 1 ]);
      }
    });
    $( "#amount" ).val( "De " + $( "#slider-range" ).slider( "values", 0 ) +
      " à " + $( "#slider-range" ).slider( "values", 1 ) );
  } );




// Others elements ---------------------------------------------------
d3.select('#title').html("À CALAIS, LA FRONTIÈRE TUE !")
d3.select('#logo').html("<img src='img/logo.png' width='250px'></img>")
//d3.select('#compteur').html(markers.getLayers().length +" morts")

// https://github.com/dwilhelm89/LeafletSlider




