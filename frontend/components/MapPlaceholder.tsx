import React from 'react';
import { Map as MapIcon, Navigation } from 'lucide-react';

const MapPlaceholder: React.FC = () => {
  return (
    <div className="w-full h-full bg-slate-100 rounded-2xl border-2 border-slate-200 overflow-hidden relative flex flex-col items-center justify-center">
      {/* Decorative background pattern to simulate a map texture */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />
      
      <div className="z-10 flex flex-col items-center text-center p-6 bg-white/80 backdrop-blur-sm rounded-2xl shadow-sm border border-white/50 max-w-xs">
        <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mb-4 shadow-inner">
          <MapIcon className="h-8 w-8 text-indigo-600" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Interactive Map</h3>
        <p className="text-sm text-slate-500 mb-4">
          This area is reserved for a Google Maps integration. It will display your generated itinerary locations.
        </p>
        <button className="inline-flex items-center px-4 py-2 border border-slate-300 shadow-sm text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors">
          <Navigation className="h-4 w-4 mr-2 text-slate-400" />
          Map Integration Pending
        </button>
      </div>
    </div>
  );
};

export default MapPlaceholder;
