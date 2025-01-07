import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  className?: string;
}

const Map = ({ 
  center = [-74.5, 40], 
  zoom = 9, 
  interactive = true,
  className = ""
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F1c2hpa2RyIiwiYSI6ImNtNW1yNHlqbDAzOTYya3E2MWI3ajBkZzYifQ.rX-4rgYQIUsBrJP8gU0IcA';

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      center: center,
      zoom: zoom,
      interactive: interactive,
      preserveDrawingBuffer: true
    });

    if (interactive) {
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    // Add marker at the center
    new mapboxgl.Marker()
      .setLngLat(center)
      .addTo(mapInstance);

    map.current = mapInstance;

    return () => {
      mapInstance.remove();
    };
  }, [center, zoom, interactive]);

  return (
    <div 
      ref={mapContainer} 
      className={className}
    />
  );
};

export default Map;