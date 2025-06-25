mapboxgl.accessToken = mapToken;
ActualCoordinates = JSON.parse(coordinates);
console.log(coordinates);
const defaultCoords = [75.8577, 22.7196];
let lan = ActualCoordinates[0];
let lat = ActualCoordinates[1];
console.log(lan, lat);
const map = new mapboxgl.Map({
  container: "map",
  //  style: "mapbox://styles/mapbox/dark-v11",
  // style: "mapbox://styles/mapbox/satellite-v9",
  //  style: "mapbox://styles/mapbox/light-v10",
  center: [lan, lat] || defaultCoords,
  zoom: 9,
});

  new mapboxgl.Marker({ color: 'red'})
    .setLngLat([lan, lat])
    .addTo(map);


