import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';

// Using a temporary public token - you should replace this with your own
mapboxgl.accessToken = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJ3ZjB5NmkwMXpvMmlsOGZpenV4OWl2In0.7c10DKBqGkE_OGDCrUbKng';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    if (!map.current) {
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v11',
        center: [-74.5, 40], // Default location
        zoom: 9
      });
    }

    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-lg shadow-lg"
      style={{ position: 'relative' }}
    />
  );
};

export default Map;