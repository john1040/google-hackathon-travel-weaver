import React from 'react';
import { CandidatePlace } from '../types.ts';
import { MapPin, Star, Clock, Building, TreePine, Utensils } from 'lucide-react';

interface CandidateListProps {
  candidates: CandidatePlace[];
}

const CandidateList: React.FC<CandidateListProps> = ({ candidates }) => {
  if (!candidates || candidates.length === 0) return null;

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'indoor': return <Building className="h-4 w-4" />;
      case 'outdoor': return <TreePine className="h-4 w-4" />;
      case 'meal': return <Utensils className="h-4 w-4" />;
      default: return <MapPin className="h-4 w-4" />;
    }
  };

  return (
    <div className="mt-8 space-y-4 pb-8">
      <div className="border-b border-slate-200 pb-3">
        <h3 className="text-lg font-semibold text-slate-800">Candidate Places</h3>
        <p className="text-sm text-slate-500">Potential spots for your trip</p>
      </div>
      
      <div className="grid grid-cols-1 gap-4">
        {candidates.map((place, idx) => (
          <div key={place.place_id || idx} className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex justify-between items-start">
              <h4 className="font-medium text-slate-900 pr-4">{place.name}</h4>
              <span className="flex items-center text-sm text-amber-500 font-medium bg-amber-50 px-2 py-0.5 rounded-md shrink-0">
                <Star className="h-3.5 w-3.5 mr-1 fill-current" />
                {place.rating}
              </span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              <span className="flex items-center text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md capitalize font-medium">
                {getTypeIcon(place.type)}
                <span className="ml-1.5">{place.type}</span>
              </span>
              <span className="flex items-center text-xs text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md">
                <Clock className="h-3.5 w-3.5 mr-1.5 text-slate-400" />
                {place.opening_hours}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CandidateList;
