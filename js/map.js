var endDate = new Date();
endDate.setUTCMinutes(0, 0, 0);

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


var points = omnivore.csv('data/Calais.csv')


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
  var markers = L.markerClusterGroup({
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
d3.select('#title').html("À CALAIS, LA FRONTIÈRE TUE !")
//d3.select('#title').html("<img src='img/title.png' width='400px'></img>")
d3.select('#compteur').html(points.getLayers().length +" morts")





});
// https://github.com/dwilhelm89/LeafletSlider




