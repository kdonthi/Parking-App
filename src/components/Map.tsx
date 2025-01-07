import React, { useEffect, useRef, useState } from 'react';
import mapboxgl from 'mapbox-gl';

const Map = () => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const [mapError, setMapError] = useState<string | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    try {
      // Initialize map only if it hasn't been initialized yet
      if (!map.current) {
        const token = 'pk.eyJ1IjoibG92YWJsZSIsImEiOiJjbHJ3ZjB5NmkwMXpvMmlsOGZpenV4OWl2In0.7c10DKBqGkE_OGDCrUbKng';
        
        // Set the token before creating the map
        mapboxgl.accessToken = token;

        const mapInstance = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v11',
          center: [-74.5, 40],
          zoom: 9,
          preserveDrawingBuffer: true // This can help with certain rendering issues
        });

        // Handle map load errors
        mapInstance.on('error', (e) => {
          console.error('Mapbox error:', e);
          setMapError('Failed to load map. Please check your connection.');
        });

        // Store the map instance
        map.current = mapInstance;
      }
    } catch (error) {
      console.error('Map initialization error:', error);
      setMapError('Failed to initialize map. Please try again later.');
    }

    // Cleanup function
    return () => {
      if (map.current) {
        map.current.remove();
        map.current = null;
      }
    };
  }, []);

  if (mapError) {
    return (
      <div className="w-full h-[500px] rounded-lg shadow-lg bg-gray-100 flex items-center justify-center">
        <p className="text-red-500">{mapError}</p>
      </div>
    );
  }

  return (
    <div 
      ref={mapContainer} 
      className="w-full h-[500px] rounded-lg shadow-lg"
      style={{ position: 'relative' }}
    />
  );
};

export default Map;