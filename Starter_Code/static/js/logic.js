let myMap = L.map("map", {
  center: [40.7608, -111.8910],
  zoom: 5
});

L.tileLayer('https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.{ext}', {
  minZoom: 0,
  maxZoom: 20,
  attribution: '&copy; <a href="https://www.stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  ext: 'png'
}).addTo(myMap);



function getColor(value) {
  if(value>90)
    return '#ff0000';
  if(value>70)
  return '#ff4000';
  if(value>50)
  return '#ff8000';
  if(value>30)
  return '#ffbf00';
  if(value>10)
  return '#ffff00';
  else
  return '#bfff00';
}

let url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

d3.json(url).then(function (response) {
  features = response.features;

  let marker_limit = features.length;
  for (let i = 0; i < marker_limit; i++) {

    let location = features[i].geometry;
    let quake_prop = features[i].properties;
    let date = quake_prop.time;
    date = new Date(date);
    if (location) {
      L.circle([location.coordinates[1], location.coordinates[0]], {
        fillOpacity: 0.75,
        color: getColor(location.coordinates[2]),
        fillColor: getColor(location.coordinates[2]),
        // Adjust the radius.
        radius: quake_prop.mag * 12000
      }).bindPopup(`<h3>${quake_prop.place}</h1> <hr> <h3>Magnitude: ${quake_prop.mag}</h3> <hr> <h3>Depth: ${location.coordinates[2]}</h3>
        <h3>Date/Time: ${date}</h3>`).addTo(myMap);
    }

  }

  // Create a legend control
  var legendControl = L.control({ position: 'bottomright' });

  // Add content to the legend
  var colors = ['#bfff00', '#ffff00', '#ffbf00','#ff8000', '#ff4000','#ff0000'];
  var quake_dep = [-10, 10, 30, 50, 70, 90]

  legendControl.onAdd = function () {
    var div = L.DomUtil.create('div', 'info legend');
    div.innerHTML = '<h4>Legend</h4>';
    // Loop through the colors and values to create the color scale
    for (var i = 0; i < colors.length; i++) {
      if (i == 5)
        div.innerHTML += '<i style=\"background:' + colors[i] + '; padding-left: 10px; margin=right:5px\"></i> ' +
          quake_dep[i] + '+<br> ';
      else {
        div.innerHTML += '<i style=\"background:' + colors[i] + '; padding-left: 10px; margin=right:5px\"></i> ' +
          quake_dep[i] + '&ndash;' + quake_dep[i + 1] + '<br> ';
      }
    }
    return div;
  };

  // Add the legend control to the map
  legendControl.addTo(myMap);
});
