import React, { useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

const styles = {
  width: '100vw',
  height: '100vh',
  position: 'absolute'
};

const Map = ({ mapStyle, children }) => {
  const [map, setMap] = useState(null);
  const mapContainer = useRef(null);

  useEffect(() => {
    mapboxgl.accessToken = process.env.REACT_APP_MAPBOX_TOKEN;
    const initializeMap = ({ setMap, mapContainer }) => {
      const map = new mapboxgl.Map({
        container: mapContainer.current,
        style: mapStyle,
        center: [0, 0],
        zoom: 5
      });

      map.on('load', () => {
        setMap(map);
        map.resize();
      });
    };

    if (!map) initializeMap({ setMap, mapContainer });
  }, [map]);

  return (
    <div ref={el => (mapContainer.current = el)} style={styles}>
      {children}
    </div>
  );
};

Map.propTypes = {};

export default Map;
