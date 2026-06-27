import React, { useEffect, useRef, useState } from 'react';
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
  const [map, setMap] = useState<any>(null);
  const markersRef = useRef<any[]>([]);
  const polylinesRef = useRef<any[]>([]);

  // Initialize Google Maps script
  useEffect(() => {
    const w = window as any;
    if (w.google && w.google.maps) {
      initMap();
      return;
    }
    
    if (document.getElementById('google-maps-script')) return;

    const script = document.createElement('script');
    script.id = 'google-maps-script';
    // Uses environment variable if available, otherwise loads without key (development mode)
    const apiKey = (process.env as any).GOOGLE_MAPS_API_KEY || '';
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
    script.async = true;
    script.defer = true;
    script.onload = initMap;
    document.head.appendChild(script);

    function initMap() {
      if (mapRef.current && !map) {
        const newMap = new w.google.maps.Map(mapRef.current, {
          center: { lat: 20, lng: 0 },
          zoom: 2,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });
        setMap(newMap);
      }
    }
  }, [map]);

  // Update map markers and polylines when itinerary or candidates change
  useEffect(() => {
    const w = window as any;
    if (!map || !w.google) return;

    // Clear existing markers and polylines
    markersRef.current.forEach(m => m.setMap(null));
    polylinesRef.current.forEach(p => p.setMap(null));
    markersRef.current = [];
    polylinesRef.current = [];

    const bounds = new w.google.maps.LatLngBounds();
    let hasPoints = false;

    // Plot Itinerary if available
    if (itinerary && itinerary.days.length > 0) {
      itinerary.days.forEach((day, dayIndex) => {
        const color = DAY_COLORS[dayIndex % DAY_COLORS.length];
        const path: any[] = [];

        day.stops.forEach((stop, stopIndex) => {
          if (typeof stop.lat !== 'number' || typeof stop.lng !== 'number') return;
          
          const position = { lat: stop.lat, lng: stop.lng };
          path.push(position);
          bounds.extend(position);
          hasPoints = true;

          const marker = new w.google.maps.Marker({
            position,
            map,
            title: stop.name,
            label: {
              text: `${stopIndex + 1}`,
              color: 'white',
              fontWeight: 'bold',
              fontSize: '12px'
            },
            icon: {
              path: w.google.maps.SymbolPath.CIRCLE,
              fillColor: color,
              fillOpacity: 1,
              strokeColor: 'white',
              strokeWeight: 2,
              scale: 12,
            }
          });
          markersRef.current.push(marker);
        });

        if (path.length > 1) {
          const polyline = new w.google.maps.Polyline({
            path,
            map,
            strokeColor: color,
            strokeOpacity: 0.8,
            strokeWeight: 4,
          });
          polylinesRef.current.push(polyline);
        }
      });
    } 
    // Plot Candidates if itinerary is not available
    else if (candidates && candidates.length > 0) {
      candidates.forEach((place) => {
        if (typeof place.lat !== 'number' || typeof place.lng !== 'number') return;
        
        const position = { lat: place.lat, lng: place.lng };
        bounds.extend(position);
        hasPoints = true;

        const marker = new w.google.maps.Marker({
          position,
          map,
          title: place.name,
          icon: {
            path: w.google.maps.SymbolPath.CIRCLE,
            fillColor: '#64748b', // slate-500
            fillOpacity: 1,
            strokeColor: 'white',
            strokeWeight: 2,
            scale: 10,
          }
        });
        markersRef.current.push(marker);
      });
    }

    if (hasPoints) {
      map.fitBounds(bounds);
      // Prevent zooming in too close if there's only one point or points are very close
      const listener = w.google.maps.event.addListener(map, "idle", () => { 
        if (map.getZoom() > 15) map.setZoom(15); 
        w.google.maps.event.removeListener(listener); 
      });
    }
  }, [map, itinerary, candidates]);

  return (
    <div className="w-full h-full bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden relative shadow-sm">
      <div ref={mapRef} className="absolute inset-0" />
      {!map && (
        <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 backdrop-blur-sm">
          <div className="animate-pulse text-slate-500 font-medium">Loading Map...</div>
        </div>
      )}
    </div>
  );
};

export default GoogleMap;
