import React from 'react';
import { Clock, MapPin } from 'lucide-react';
import { Itinerary } from '../types.ts';

interface ItineraryDisplayProps {
  itinerary: Itinerary | null;
}

const ItineraryDisplay: React.FC<ItineraryDisplayProps> = ({ itinerary }) => {
  if (!itinerary) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-slate-400 border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50/50 mt-6">
        <p className="text-sm font-medium">Your itinerary will appear here</p>
        <p className="text-xs mt-1">Fill out the form above to get started</p>
      </div>
    );
  }

  return (
    <div className="mt-8 space-y-8 pb-12">
      <div className="border-b border-slate-200 pb-4">
        <h2 className="text-2xl font-bold text-slate-900">Your Trip to {itinerary.destination}</h2>
        <p className="text-slate-500 mt-1">{itinerary.days.length} Days of Adventure</p>
      </div>

      <div className="space-y-8">
        {itinerary.days.map((day) => (
          <div key={day.day} className="relative">
            {/* Timeline line */}
            <div className="absolute top-0 bottom-0 left-[1.15rem] w-0.5 bg-indigo-100 -z-10"></div>
            
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center border-4 border-white shadow-sm">
                <span className="text-indigo-700 font-bold text-sm">{day.day}</span>
              </div>
              <h3 className="ml-4 text-lg font-semibold text-slate-800">
                Day {day.day} {day.theme && <span className="text-slate-500 font-normal text-base ml-2">- {day.theme}</span>}
              </h3>
            </div>

            <div className="ml-12 space-y-4">
              {day.stops.map((stop, index) => (
                <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 hover:shadow-md transition-shadow">
                  <div className="flex items-start">
                    <div className="flex-shrink-0 mt-1">
                      <Clock className="h-4 w-4 text-indigo-400" />
                    </div>
                    <div className="ml-3 w-full">
                      <div className="flex justify-between items-start mb-1">
                        <p className="text-sm font-medium text-indigo-600">{stop.time}</p>
                        {stop.type && (
                          <span className="text-[10px] uppercase tracking-wider font-semibold text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full">
                            {stop.type}
                          </span>
                        )}
                      </div>
                      <p className="font-semibold text-slate-800 mb-1">{stop.name}</p>
                      <p className="text-slate-600 text-sm leading-relaxed">{stop.description}</p>
                      
                      <div className="mt-3 flex items-center text-xs text-slate-500 bg-slate-50 p-2 rounded-lg inline-flex">
                        <MapPin className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                        {stop.lat.toFixed(4)}, {stop.lng.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ItineraryDisplay;
