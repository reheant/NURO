// import * as React from 'react';
// import { useState, useCallback } from 'react';
// import { createRoot } from 'react-dom/client';
// import MapGL from 'react-map-gl'; // Change import to MapGL
// import DrawControl from './draw-control';
// import ControlPanel from './control-panel';

// const TOKEN = 'pk.eyJ1IjoiYWJpbGFzaDEiLCJhIjoiY2x0OXJzMXE5MDhrajJyb3Y3YnFwa25maiJ9.N7tI58w8MejLLvL8rJzEfA'; // Set your mapbox token here

// export default function Maps() {
//   const [features, setFeatures] = useState({});

//   const onUpdate = useCallback((e: { features: any }) => {
//     setFeatures(currFeatures => {
//       const newFeatures: any = { ...currFeatures };
//       for (const f of e.features) {
//         newFeatures[f.id] = f;
//       }
//       return newFeatures;
//     });
//   }, []);

//   const onDelete = useCallback((e: { features: any }) => {
//     setFeatures(currFeatures => {
//       const newFeatures: any = { ...currFeatures };
//       for (const f of e.features) {
//         delete newFeatures[f.id];
//       }
//       return newFeatures;
//     });
//   }, []);

//   return (
//     <>
//       <MapGL
//         // width="100%"
//         // height="100%"
//         mapStyle="mapbox://styles/mapbox/satellite-v9"
//         mapboxAccessToken={TOKEN}
//         latitude={45.5017} // Montreal latitude
//         longitude={-73.5673} // Montreal longitude
//         zoom={12}
//       >
//         {/* Add SVG element for pulsating pin */}
//         <svg
//           xmlns="http://www.w3.org/2000/svg"
//           width="24"
//           height="24"
//           viewBox="0 0 24 24"
//           style={{
//             position: 'absolute',
//             left: '50%',
//             top: '50%',
//             transform: 'translate(-50%, -50%)',
//             animation: 'pulse 2s infinite',
//             zIndex: 999,
//           }}
//         >
//           <circle cx="12" cy="12" r="12" fill="blue" opacity="0.3" />
//         </svg>

//         {/* Draw Control */}
//         <DrawControl
//           position="top-left"
//           displayControlsDefault={false}
//           controls={{
//             polygon: true,
//             trash: true
//           }}
//           defaultMode="draw_polygon"
//           onCreate={onUpdate}
//           onUpdate={onUpdate}
//           onDelete={onDelete}
//         />
//       </MapGL>
//       <ControlPanel polygons={Object.values(features)} />
//     </>
//   );
// }

// export function renderToDom(container: Element | DocumentFragment) {
//   createRoot(container).render(<Maps />);
// }




import * as React from 'react';
import {useState, useCallback} from 'react';
import {createRoot} from 'react-dom/client';
import Map from 'react-map-gl';
import DrawControl from './draw-control';
import ControlPanel from './control-panel';

const TOKEN = 'pk.eyJ1IjoiYWJpbGFzaDEiLCJhIjoiY2x0OXJzMXE5MDhrajJyb3Y3YnFwa25maiJ9.N7tI58w8MejLLvL8rJzEfA'; // Set your mapbox token here

export default function Maps() {
  const [features, setFeatures] = useState({});

  const onUpdate = useCallback((e: { features: any; }) => {
    setFeatures(currFeatures => {
      const newFeatures: any = {...currFeatures};
      for (const f of e.features) {
        newFeatures[f.id] = f;
      }
      return newFeatures;
    });
  }, []);

  const onDelete = useCallback((e: { features: any; }) => {
    setFeatures(currFeatures => {
      const newFeatures: any = {...currFeatures};
      for (const f of e.features) {
        delete newFeatures[f.id];
      }
      return newFeatures;
    });
  }, []);

  // Define the latitude and longitude for the fixed position
  const fixedLatitude = 45.5017; // Montreal latitude
  const fixedLongitude = -73.5673; // Montreal longitude

  return (
    <>
      <Map
        initialViewState={{
        latitude: 45.5017, // Montreal latitude
        longitude: -73.5673, // Montreal longitude
          zoom: 9
        }}
        mapStyle="mapbox://styles/mapbox/satellite-v9"
        mapboxAccessToken={TOKEN}
      >

         {/* SVG element for person icon */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          style={{
            position: 'absolute',
            left: 0,
            top: 0,
            transform: `translate(${getPixelX(fixedLongitude)}px, ${getPixelY(fixedLatitude)}px)`, // Use latitude and longitude to position the SVG
            zIndex: 999,
          }}
        >
          {/* Example person icon */}
          <path fill="blue" d="M12 0c-6.628 0-12 5.373-12 12 0 7.369 12 24 12 24s12-16.631 12-24c0-6.627-5.372-12-12-12zm0 17c-2.206 0-4-1.794-4-4s1.794-4 4-4 4 1.794 4 4-1.794 4-4 4z"/>
        </svg>

        {/* Draw Control */}
        <DrawControl
          position="top-left"
          displayControlsDefault={false}
          controls={{
            polygon: true,
            trash: true
          }}
          defaultMode="draw_polygon"
          onCreate={onUpdate}
          onUpdate={onUpdate}
          onDelete={onDelete}
        />
      </Map>
      <ControlPanel polygons={Object.values(features)} />
    </>
  );
}

// Function to convert longitude to pixel X coordinate
function getPixelX(longitude: number) {
  return ((longitude + 180) / 360) * 512 * Math.pow(2, 9);
}

// Function to convert latitude to pixel Y coordinate
function getPixelY(latitude: number) {
  const f = Math.PI / 180;
  return (
    (1 -
      Math.log(
        Math.tan((latitude * f + Math.PI / 2) / 2)
      ) /
        Math.PI) *
    256 *
    Math.pow(2, 9)
  );
}

export function renderToDom(container: Element | DocumentFragment) {
  createRoot(container).render(<Maps />);
}