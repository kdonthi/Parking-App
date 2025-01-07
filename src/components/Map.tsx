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
    price?: number;
    available?: boolean;
    coordinates: { lat: number; lng: number } | null;
  }>;
  onMarkerClick?: (spotId: number) => void;
}

const Map = ({ 
  center = [-74.5, 40], 
  zoom = 9, 
  interactive = true,
  className = "",
  spots = [],
  onMarkerClick
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
        const markerElement = document.createElement('div');
        markerElement.className = 'cursor-pointer';
        
        const marker = new mapboxgl.Marker(markerElement)
          .setLngLat([spot.coordinates.lng, spot.coordinates.lat])
          .setPopup(
            new mapboxgl.Popup({ offset: 25 })
              .setHTML(`
                <div class="p-2">
                  <h3 class="font-bold">${spot.location}</h3>
                  ${spot.price ? `<p>${spot.price} tokens</p>` : ''}
                  ${spot.available ? '<p class="text-green-600">Available</p>' : '<p class="text-red-600">Taken</p>'}
                  ${spot.available ? '<p class="text-sm text-blue-600">Click marker to purchase</p>' : ''}
                </div>
              `)
          )
          .addTo(map.current!);

        if (onMarkerClick && spot.available) {
          markerElement.addEventListener('click', () => {
            onMarkerClick(spot.id);
          });
        }
        
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
  }, [spots, onMarkerClick]);

  return (
    <div 
      ref={mapContainer} 
      className={className}
    />
  );
};

export default Map;