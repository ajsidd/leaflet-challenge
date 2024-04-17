// Initialize the map
var myMap = L.map("map", {
    center: [0, 0],
    zoom: 2
});

// Add a tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

// GeoJSON URL
var geojsonURL = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/significant_month.geojson";

// Fetch the earthquake data from the GeoJSON URL using D3
d3.json(geojsonURL).then(function(data) {

    // Function to determine marker size based on earthquake magnitude
    function markerSize(magnitude) {
        return magnitude * 5;
    }

    // Function to determine marker color based on earthquake depth
    function markerColor(depth) {
        if (depth > 300) {
            return "#FF4500";
        } else if (depth > 200) {
            return "#FF8C00";
        } else if (depth > 100) {
            return "#FFD700";
        } else {
            return "#ADFF2F";
        }
    }

    // Create a GeoJSON layer with the earthquake data
    var earthquakes = L.geoJSON(data.features, {
        pointToLayer: function(feature, latlng) {
            return L.circleMarker(latlng, {
                radius: markerSize(feature.properties.mag),
                fillColor: markerColor(feature.geometry.coordinates[2]),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            }).bindPopup("<h3>" + feature.properties.place +
                        "</h3><hr><p>Magnitude: " + feature.properties.mag +
                        "<br>Depth: " + feature.geometry.coordinates[2] + "</p>");
        }
    }).addTo(myMap);

    // Legend
    var legend = L.control({ position: "bottomright" });

    legend.onAdd = function() {
        var div = L.DomUtil.create("div", "info legend"),
            depths = [0, 100, 200, 300],
            labels = [];

        // Loop through the depth intervals and generate a label with a colored square for each interval
        for (var i = 0; i < depths.length; i++) {
            div.innerHTML +=
                '<i style="background:' + markerColor(depths[i] + 1) + '"></i> ' +
                depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
        }

        return div;
    };

    legend.addTo(myMap);
})