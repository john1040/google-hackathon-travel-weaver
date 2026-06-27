import React, { useState } from 'react';
import { MapPin, Calendar, Sparkles, Loader2, Search } from 'lucide-react';
import { TripFormData } from '../types.ts';

interface TripFormProps {
  onSubmit: (data: TripFormData) => void;
  onFetchCandidates: (data: TripFormData) => void;
  isLoading: boolean;
  isFetchingCandidates: boolean;
}

const TripForm: React.FC<TripFormProps> = ({ onSubmit, onFetchCandidates, isLoading, isFetchingCandidates }) => {
  const [destination, setDestination] = useState('');
  const [days, setDays] = useState<number | ''>('');
  const [preferences, setPreferences] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!destination || !days) return;
    
    onSubmit({
      destination,
      days: Number(days),
      preferences
    });
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 space-y-5">
      <div>
        <label htmlFor="destination" className="block text-sm font-medium text-slate-700 mb-1">
          Destination
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <MapPin className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="text"
            id="destination"
            required
            value={destination}
            onChange={(e) => setDestination(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="e.g., Kyoto, Japan"
          />
        </div>
      </div>

      <div>
        <label htmlFor="days" className="block text-sm font-medium text-slate-700 mb-1">
          Number of Days
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Calendar className="h-5 w-5 text-slate-400" />
          </div>
          <input
            type="number"
            id="days"
            required
            min="1"
            max="30"
            value={days}
            onChange={(e) => setDays(e.target.value === '' ? '' : Number(e.target.value))}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors"
            placeholder="e.g., 5"
          />
        </div>
      </div>

      <div>
        <label htmlFor="preferences" className="block text-sm font-medium text-slate-700 mb-1">
          Preferences & Interests
        </label>
        <div className="relative">
          <div className="absolute top-3 left-3 pointer-events-none">
            <Sparkles className="h-5 w-5 text-slate-400" />
          </div>
          <textarea
            id="preferences"
            rows={3}
            value={preferences}
            onChange={(e) => setPreferences(e.target.value)}
            className="block w-full pl-10 pr-3 py-2.5 border border-slate-300 rounded-xl focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm transition-colors resize-none"
            placeholder="e.g., Vegetarian food, historical sites, relaxed pace..."
          />
        </div>
      </div>

      <div className="flex space-x-3 pt-2">
        <button
          type="button"
          onClick={() => onFetchCandidates({ destination, days: Number(days) || 1, preferences })}
          disabled={isFetchingCandidates || !destination}
          className="w-1/2 flex justify-center items-center py-2.5 px-4 border border-indigo-200 rounded-xl shadow-sm text-sm font-medium text-indigo-700 bg-indigo-50 hover:bg-indigo-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isFetchingCandidates ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            <>
              <Search className="h-4 w-4 mr-2" />
              Find Places
            </>
          )}
        </button>
        <button
          type="submit"
          disabled={isLoading || !destination || !days}
          className="w-1/2 flex justify-center items-center py-2.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
        >
          {isLoading ? (
            <Loader2 className="animate-spin h-4 w-4" />
          ) : (
            'Plan Trip'
          )}
        </button>
      </div>
    </form>
  );
};

export default TripForm;
