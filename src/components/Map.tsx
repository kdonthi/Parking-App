import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

interface MapProps {
  center?: [number, number];
  zoom?: number;
  interactive?: boolean;
  className?: string;
  spots?: Array<{
    id: number;
    location: string;
    coordinates: { lat: number; lng: number } | null;
  }>;
}

const Map = ({ 
  center = [-74.5, 40], 
  zoom = 9, 
  interactive = true,
  className = "",
  spots = []
}: MapProps) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);

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

    // Add marker at the center if no spots are provided
    if (spots.length === 0) {
      new mapboxgl.Marker()
        .setLngLat(center)
        .addTo(mapInstance);
    }

    map.current = mapInstance;

    return () => {
      markers.current.forEach(marker => marker.remove());
      mapInstance.remove();
    };
  }, [center, zoom, interactive]);

  // Effect for handling spots
  useEffect(() => {
    if (!map.current) return;

    // Remove existing markers
    markers.current.forEach(marker => marker.remove());
    markers.current = [];

    // Add new markers for each spot
    spots.forEach(spot => {
      if (spot.coordinates) {
        const marker = new mapboxgl.Marker()
          .setLngLat([spot.coordinates.lng, spot.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`<h3>${spot.location}</h3>`)
          )
          .addTo(map.current!);
        
        markers.current.push(marker);
      }
    });

    // If there are spots, fit the map to show all markers
    if (spots.length > 0 && map.current) {
      const bounds = new mapboxgl.LngLatBounds();
      spots.forEach(spot => {
        if (spot.coordinates) {
          bounds.extend([spot.coordinates.lng, spot.coordinates.lat]);
        }
      });
      map.current.fitBounds(bounds, { padding: 50 });
    }
  }, [spots]);

  return (
    <div 
      ref={mapContainer} 
      className={className}
    />
  );
};

export default Map;