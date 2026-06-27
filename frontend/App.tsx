import React, { useState } from 'react';
import { Compass, Settings2 } from 'lucide-react';
import TripForm from './components/TripForm.tsx';
import ItineraryDisplay from './components/ItineraryDisplay.tsx';
import CandidateList from './components/CandidateList.tsx';
import GoogleMap from './components/GoogleMap.tsx';
import { generateItinerary } from './services/geminiService.ts';
import { getCandidates } from './server/api.ts';
import { Itinerary, TripFormData, CandidatePlace } from './types.ts';

function App() {
  // State as requested
  const [itinerary, setItinerary] = useState<Itinerary | null>(null);
  const [candidates, setCandidates] = useState<CandidatePlace[] | null>(null);
  const [environmentId, setEnvironmentId] = useState<string>('env-prod-tw-01');
  
  // UI State
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingCandidates, setIsFetchingCandidates] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFetchCandidates = async (formData: TripFormData) => {
    setIsFetchingCandidates(true);
    setError(null);
    setItinerary(null); // Clear itinerary to show candidates on map
    try {
      // Calls our simulated server-side endpoint
      const results = await getCandidates(formData.destination, formData.preferences);
      setCandidates(results);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch candidates.');
    } finally {
      setIsFetchingCandidates(false);
    }
  };

  const handlePlanTrip = async (formData: TripFormData) => {
    setIsLoading(true);
    setError(null);
    try {
      const generatedItinerary = await generateItinerary(formData);
      setItinerary(generatedItinerary);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An unexpected error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-slate-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex-shrink-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-indigo-600 p-2 rounded-xl shadow-inner">
              <Compass className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Trip Weaver</h1>
          </div>
          <div className="flex items-center text-xs text-slate-400 font-mono bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
            <Settings2 className="h-3.5 w-3.5 mr-1.5" />
            Env: {environmentId}
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 overflow-hidden flex flex-col md:flex-row max-w-7xl mx-auto w-full">
        
        {/* Left Panel: Form & Itinerary (Scrollable) */}
        <div className="w-full md:w-1/2 lg:w-5/12 h-full flex flex-col border-r border-slate-200 bg-white shadow-[4px_0_24px_rgba(0,0,0,0.02)] z-0">
          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-md mx-auto">
              <div className="mb-8">
                <h2 className="text-xl font-semibold text-slate-800 mb-2">Where to next?</h2>
                <p className="text-sm text-slate-500">Let AI weave the perfect itinerary for your next adventure.</p>
              </div>
              
              <TripForm 
                onSubmit={handlePlanTrip} 
                onFetchCandidates={handleFetchCandidates}
                isLoading={isLoading} 
                isFetchingCandidates={isFetchingCandidates}
              />
              
              {error && (
                <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl text-red-600 text-sm">
                  {error}
                </div>
              )}

              {!itinerary && candidates && (
                <CandidateList candidates={candidates} />
              )}

              <ItineraryDisplay itinerary={itinerary} />
            </div>
          </div>
        </div>

        {/* Right Panel: Interactive Map (Fixed) */}
        <div className="hidden md:block w-full md:w-1/2 lg:w-7/12 h-full p-6 bg-slate-50/50">
          <GoogleMap itinerary={itinerary} candidates={candidates} />
        </div>
        
      </main>
    </div>
  );
}

export default App;
