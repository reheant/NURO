import mapboxgl from 'mapbox-gl';
import MapboxDraw from '@mapbox/mapbox-gl-draw';

export function createMap() {
    // Access token is required to use Mapbox GL
    mapboxgl.accessToken = 'pk.eyJ1IjoiYWJpbGFzaDEiLCJhIjoiY2x0OXJzMXE5MDhrajJyb3Y3YnFwa25maiJ9.N7tI58w8MejLLvL8rJzEfA';

    // Function to check if the webpage has a specific class
    function hasClass(className: string) {
        return document.documentElement.classList.contains(className);
    }

    // Determine the initial map style based on the webpage class
    let mapStyle = hasClass('dark') ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11';

    // Create a map object
    const map = new mapboxgl.Map({
        container: 'map', // container id
        style: mapStyle, // stylesheet location
        center: [-75.7, 45.4], // starting position [lng, lat]
        zoom: 15 // starting zoom
    });

    // Create a blue marker at a specific location
    const marker = new mapboxgl.Marker({
        color: '#3FB1CE' // Set the color of the marker to blue
    })
    .setLngLat([-75.7, 45.4]) // Set the marker's location [longitude, latitude]
    .addTo(map);

    // Initialize Mapbox Draw
    const draw = new MapboxDraw({
        displayControlsDefault: false,
        controls: {
            polygon: true,
            trash: true
        }
    });

    // Add the draw control to the map
    map.addControl(draw);
    
    // Update map style based on HTML class changes
    function updateMapStyle() {
        const newMapStyle = hasClass('dark') ? 'mapbox://styles/mapbox/dark-v10' : 'mapbox://styles/mapbox/streets-v11';
        if (newMapStyle !== mapStyle) {
            map.setStyle(newMapStyle);
            mapStyle = newMapStyle;
        }
    }

    // Create a MutationObserver to listen for changes in class attribute
    const observer = new MutationObserver((mutationsList, observer) => {
        for (let mutation of mutationsList) {
            if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                updateMapStyle();
                break;
            }
        }
    });

    // Start observing changes to the class attribute
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
}