import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Itinerary, CandidatePlace } from '../types.ts';

interface GoogleMapProps {
  itinerary: Itinerary | null;
  candidates?: CandidatePlace[] | null;
}

const DAY_COLORS = [
  '#4f46e5', // Indigo 600
  '#16a34a', // Green 600
  '#ea580c', // Orange 600
  '#e11d48', // Rose 600
  '#0284c7', // Light Blue 600
  '#9333ea', // Purple 600
  '#0d9488', // Teal 600
];

const GoogleMap: React.FC<GoogleMapProps> = ({ itinerary, candidates }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const layerGroupRef = useRef<L.LayerGroup | null>(null);

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create map instance
    const map = L.map(mapRef.current).setView([20, 0], 2);
    
    // Add OpenStreetMap tiles (Free, no API key required, fixes the watermark/error issue)
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(map);
    
    // Create a layer group for our markers and polylines
    const layerGroup = L.layerGroup().addTo(map);
    
    mapInstanceRef.current = map;
    layerGroupRef.current = layerGroup;

    // Cleanup on unmount
    return () => {
      map.remove();
      mapInstanceRef.current = null;
      layerGroupRef.current = null;
    };
  }, []);

  // Update markers and polylines when data changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const layerGroup = layerGroupRef.current;

    if (!map || !layerGroup) return;

    // Clear existing layers
    layerGroup.clearLayers();

    const bounds = L.latLngBounds([]);
    let hasPoints = false;

    const createIcon = (text: string, color: string) => {
      return L.divIcon({
        className: 'custom-marker',
        html: `<div style="background-color: ${color}; width: 28px; height: 28px; border-radius: 50%; border: 2px solid white; color: white; display: flex; align-items: center; justify-content: center; font-weight: bold; font-size: 12px; box-shadow: 0 2px 4px rgba(0,0,0,0.3);">${text}</div>`,
        iconSize: [28, 28],
        iconAnchor: [14, 14],
      });
    };

    // Plot Itinerary if available
    if (itinerary && itinerary.days.length > 0) {
      itinerary.days.forEach((day, dayIndex) => {
        const color = DAY_COLORS[dayIndex % DAY_COLORS.length];
        const latlngs: L.LatLngExpression[] = [];

        day.stops.forEach((stop, stopIndex) => {
          if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;
          
          const latlng: L.LatLngExpression = [stop.lat, stop.lng];
          latlngs.push(latlng);
          bounds.extend(latlng);
          hasPoints = true;

          const marker = L.marker(latlng, {
            icon: createIcon(`${stopIndex + 1}`, color),
            title: stop.name
          }).bindPopup(`<b>${stop.name}</b><br/>${stop.time}`);
          
          layerGroup.addLayer(marker);
        });

        if (latlngs.length > 1) {
          const polyline = L.polyline(latlngs, { color, weight: 4, opacity: 0.8 });
          layerGroup.addLayer(polyline);
        }
      });
    } 
    // Plot Candidates if itinerary is not available
    else if (candidates && candidates.length > 0) {
      candidates.forEach((place) => {
        if (typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
        
        const latlng: L.LatLngExpression = [place.lat, place.lng];
        bounds.extend(latlng);
        hasPoints = true;

        const marker = L.marker(latlng, {
          icon: createIcon('', '#64748b'), // slate-500
          title: place.name
        }).bindPopup(`<b>${place.name}</b><br/>Rating: ${place.rating}`);
        
        layerGroup.addLayer(marker);
      });
    }

    if (hasPoints) {
      map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15 });
    } else {
      map.setView([20, 0], 2); // Reset view if no points
    }

  }, [itinerary, candidates]);

  return (
    <div className="w-full h-full bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden relative shadow-sm z-0">
      <div ref={mapRef} className="absolute inset-0 z-0" />
    </div>
  );
};

export default GoogleMap;
