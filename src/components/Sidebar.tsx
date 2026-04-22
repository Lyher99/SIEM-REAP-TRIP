import React from 'react';
import { Place } from '../types';
import { Search, Filter, MapPin, Star, Navigation } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface SidebarProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
  selectedPlaceId?: string;
  filter: string;
  setFilter: (filter: string) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onNearMe: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  places,
  onSelectPlace,
  selectedPlaceId,
  filter,
  setFilter,
  searchQuery,
  setSearchQuery,
  onNearMe,
}) => {
  const categories = ['All', 'Temple', 'Hotel', 'Restaurant', 'Cafe', 'Activity'];

  const filteredPlaces = places.filter((p) => {
    const matchesFilter = filter === 'All' || p.category === filter;
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="flex flex-col h-full w-full bg-white z-20 overflow-hidden">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-serif text-lg italic text-ink">Filters</h2>
          <button 
            onClick={() => { setFilter('All'); setSearchQuery(''); }}
            className="text-[10px] uppercase font-bold text-primary"
          >
            Reset
          </button>
        </div>

        {/* Filters Grid */}
        <div className="grid grid-cols-2 gap-2 mb-8">
          {categories.slice(1).map((cat) => (
             <button
                key={cat}
                onClick={() => setFilter(filter === cat ? 'All' : cat)}
                className={cn(
                  "flex items-center gap-2 px-3 py-2 rounded border text-[10px] font-heavy tracking-wider uppercase transition-all",
                  filter === cat 
                    ? "border-primary bg-primary/10 text-ink" 
                    : "border-border hover:border-primary text-ink/70"
                )}
             >
                <span className={cn(
                  "w-1.5 h-1.5 rounded-full",
                  cat === 'Temple' ? "bg-primary" :
                  cat === 'Hotel' ? "bg-blue-400" :
                  cat === 'Restaurant' ? "bg-orange-400" :
                  cat === 'Cafe' ? "bg-orange-300" : "bg-accent"
                )}></span>
                {cat}
             </button>
          ))}
        </div>

        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-serif text-lg italic text-ink">Near You</h2>
          <button 
            onClick={onNearMe}
            className="text-[10px] bg-accent text-white px-2 py-0.5 rounded font-bold tracking-widest uppercase hover:bg-accent/90 transition-all"
          >
            GPS ACTIVE
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[calc(100vh-420px)] pr-2 no-scrollbar">
          {filteredPlaces.map((place) => (
            <div
              key={place.id}
              onClick={() => onSelectPlace(place)}
              className={cn(
                "group cursor-pointer transition-all duration-300",
                selectedPlaceId === place.id ? "opacity-100" : "opacity-70 hover:opacity-100"
              )}
            >
              <div className="flex gap-3 mb-2">
                <div className="w-16 h-16 bg-border rounded flex-shrink-0 flex items-center justify-center text-[10px] text-center p-2 uppercase font-bold text-ink/60 overflow-hidden">
                  {place.image ? (
                    <img src={place.image} alt="" className="w-full h-full object-cover rounded-sm" referrerPolicy="no-referrer" />
                  ) : place.name}
                </div>
                <div>
                  <h3 className={cn(
                    "text-sm font-bold leading-tight transition-colors",
                    selectedPlaceId === place.id ? "text-primary" : "text-ink group-hover:text-primary"
                  )}>
                    {place.name}
                  </h3>
                  <p className="text-[11px] text-neutral-500 mb-1">{place.category} • Exploring</p>
                  <div className="flex items-center gap-1">
                    <span className="text-primary text-xs tracking-tight">
                      {'★'.repeat(Math.floor(place.rating))}
                      {'☆'.repeat(5 - Math.floor(place.rating))}
                    </span>
                    <span className="text-[10px] font-bold text-neutral-400">(Featured)</span>
                  </div>
                </div>
              </div>
              <div className="h-[1px] w-full bg-background"></div>
            </div>
          ))}

          {filteredPlaces.length === 0 && (
            <div className="py-10 text-center opacity-30 italic text-sm">No places found</div>
          )}
        </div>
      </div>

      <div className="mt-auto p-6 bg-surface border-t border-border">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-ink/80">Live Traffic Updates</span>
        </div>
        <p className="text-[11px] text-neutral-600 leading-relaxed">Moderate traffic near Sivutha Blvd. 5 min delay estimated for tuk-tuks.</p>
      </div>
    </div>
  );
};
