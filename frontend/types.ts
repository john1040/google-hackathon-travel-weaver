export interface Stop {
  name: string;
  type: string;
  lat: number;
  lng: number;
  time: string;
  description: string;
}

export interface DayPlan {
  day: number;
  theme?: string;
  stops: Stop[];
}

export interface Itinerary {
  destination: string;
  days: DayPlan[];
}

export interface TripFormData {
  destination: string;
  days: number;
  preferences: string;
}

export interface CandidatePlace {
  name: string;
  place_id: string;
  lat: number;
  lng: number;
  type: 'indoor' | 'outdoor' | 'meal';
  opening_hours: string;
  rating: number;
}
