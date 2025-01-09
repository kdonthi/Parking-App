import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { useParkingSpotsStore } from '@/store/parkingSpots';

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

const formatLocation = (location: string) => {
  // Split the address into parts
  const parts = location.split(',').map(part => part.trim());
  if (parts.length >= 1) {
    // Get the street name without number
    const streetPart = parts[0];
    // Updated regex to better match street numbers
    const streetNameMatch = streetPart.match(/^(\d+(?:\s*-?\s*\d*)*\s+)?(.+)/);
    const streetName = streetNameMatch ? streetNameMatch[2] : streetPart;
    
    // Return only street name and remaining parts (city, state, zip)
    return [streetName, ...parts.slice(1)].join(', ');
  }
  return location;
};

const Map: React.FC<MapProps> = ({ 
  zoom = 3, 
  interactive = true,
  className = "",
  spots = [],
  onMarkerClick
}) => {
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<mapboxgl.Map | null>(null);
  const markers = useRef<mapboxgl.Marker[]>([]);
  const parkingSpots = useParkingSpotsStore((state) => state.spots);

  useEffect(() => {
    if (!mapContainer.current) return;

    mapboxgl.accessToken = 'pk.eyJ1Ijoia2F1c2hpa2RyIiwiYSI6ImNtNW1yNHlqbDAzOTYya3E2MWI3ajBkZzYifQ.rX-4rgYQIUsBrJP8gU0IcA';

    const mapInstance = new mapboxgl.Map({
      container: mapContainer.current,
      style: 'mapbox://styles/mapbox/streets-v11',
      zoom: zoom,
      interactive: interactive,
      preserveDrawingBuffer: true
    });

    map.current = mapInstance;

    if (interactive) {
      mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right');
    }

    parkingSpots.filter(s => s.available).map(s => s.coordinates).forEach(({lat, lng}) => {
      new mapboxgl.Marker()
        .setLngLat([lng, lat])
        .addTo(mapInstance);
    });
    
    return () => {
      markers.current.forEach(marker => marker.remove());
      mapInstance.remove();
    };
  }, [zoom, interactive, parkingSpots]);

  useEffect(() => {
    if (!map.current) return;

    markers.current.forEach(marker => marker.remove());
    markers.current = [];

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
                  <h3 class="font-bold">${formatLocation(spot.location)}</h3>
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