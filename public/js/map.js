
var map = L.map("my-map").setView([coordinates0[1],coordinates0[0]], 10);

// Get your own API Key on https://myprojects.geoapify.com
var myAPIKey = api;

// Retina displays require different mat tiles quality
var isRetina = L.Browser.retina;

var baseUrl =
  "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}.png?apiKey={apiKey}";
var retinaUrl =
  "https://maps.geoapify.com/v1/tile/osm-bright/{z}/{x}/{y}@2x.png?apiKey={apiKey}";

// Add map tiles layer. Set 20 as the maximal zoom and provide map data attribution.
L.tileLayer(isRetina ? retinaUrl : baseUrl, {
  attribution:
    'Powered by <a href="https://www.geoapify.com/" target="_blank">Geoapify</a> | © OpenStreetMap <a href="https://www.openstreetmap.org/copyright" target="_blank">contributors</a>',
  apiKey: myAPIKey,
  maxZoom: 20,
  id: "osm-bright",
}).addTo(map);
console.log(coordinates0)
   // Define a custom icon for the marker
   const customIcon = L.icon({
    iconUrl: 'https://static.vecteezy.com/system/resources/previews/024/971/525/original/map-marker-and-location-pin-3d-red-location-pin-for-gps-map-location-pin-and-gps-pointer-free-png.png', // Replace with your custom marker icon URL
      iconSize: [32, 32], // Customize icon size
      iconAnchor: [16, 32], // Adjust the anchor to the bottom of the icon (for pins)
      popupAnchor: [0, -32]  // Point from which the popup should open relative to the iconAnchor
  });

  // Add the custom marker at the specified coordinates
  const marker = L.marker([coordinates0[1],coordinates0[0]], { icon: customIcon }).addTo(map);
  
marker.bindPopup(`<h5>${placename}</h5>`).openPopup();
