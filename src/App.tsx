/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { TravelMap } from './components/TravelMap';
import { Sidebar } from './components/Sidebar';
import { DetailPanel } from './components/DetailPanel';
import { FullDetailView } from './components/FullDetailView';
import { Place, AppState } from './types';
import { subscribeToPlaces, seedInitialData } from './services/placeService';
import { Loader2, Heart } from 'lucide-react';
import { AnimatePresence } from 'motion/react';
import { TravelSuggestions } from './components/TravelSuggestions';
import { cn } from './lib/utils';

export default function App() {
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem('savedPlaceIds');
    return {
      places: [],
      selectedPlace: null,
      userLocation: null,
      filter: 'All',
      searchQuery: '',
      loading: true,
      fullViewPlace: null,
      savedPlaceIds: saved ? JSON.parse(saved) : [],
      activeTab: 'explore',
    };
  });

  useEffect(() => {
    localStorage.setItem('savedPlaceIds', JSON.stringify(state.savedPlaceIds));
  }, [state.savedPlaceIds]);

  useEffect(() => {
    // Initial Seed
    const init = async () => {
      await seedInitialData();
    };
    init();

    // Subscribe to places
    const unsubscribe = subscribeToPlaces((places) => {
      setState(prev => ({ ...prev, places, loading: false }));
    });

    return () => unsubscribe();
  }, []);

  const handleSelectPlace = (place: Place) => {
    setState(prev => ({ ...prev, selectedPlace: place, activeTab: 'explore' }));
  };

  const handleToggleSave = (placeId: string) => {
    setState(prev => {
      const isSaved = prev.savedPlaceIds.includes(placeId);
      if (isSaved) {
        return { ...prev, savedPlaceIds: prev.savedPlaceIds.filter(id => id !== placeId) };
      } else {
        return { ...prev, savedPlaceIds: [...prev.savedPlaceIds, placeId] };
      }
    });
  };

  const handleNearMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setState(prev => ({
            ...prev,
            userLocation: {
              lat: position.coords.latitude,
              lng: position.coords.longitude,
            },
          }));
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  const toggleNavigation = () => {
    // Deprecated for external map redirect
  };

  if (state.loading) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-background text-primary">
        <Loader2 className="animate-spin" size={48} />
      </div>
    );
  }

  const savedPlaces = state.places.filter(p => state.savedPlaceIds.includes(p.id));

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-background font-sans text-ink">
      <AnimatePresence>
        {state.fullViewPlace && (
          <FullDetailView 
            place={state.fullViewPlace} 
            onClose={() => setState(prev => ({ ...prev, fullViewPlace: null }))}
            isSaved={state.savedPlaceIds.includes(state.fullViewPlace.id)}
            onToggleSave={() => handleToggleSave(state.fullViewPlace!.id)}
          />
        )}
      </AnimatePresence>

      {/* Top Navigation */}
      <header className="h-16 bg-white border-b border-border flex items-center justify-between px-6 z-[1001]">
        <div className="flex items-center gap-8">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-primary rounded-sm flex items-center justify-center">
              <div className="w-4 h-4 border-2 border-white transform rotate-45"></div>
            </div>
            <h1 className="font-serif text-xl font-bold tracking-tight uppercase text-ink">SIEM REAP <span className="text-primary">TRIP</span></h1>
          </div>
          <div className="hidden lg:block relative">
            <input 
              type="text" 
              placeholder="Search temples, hotels, or cafes..." 
              value={state.searchQuery}
              onChange={(e) => setState(prev => ({ ...prev, searchQuery: e.target.value }))}
              className="w-80 h-10 pl-10 pr-4 bg-surface border border-border rounded-full text-sm focus:outline-none focus:border-primary text-ink"
            />
            <div className="absolute left-3 top-2.5 opacity-40 text-ink">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
            </div>
          </div>
        </div>
        <nav className="flex items-center gap-6 text-xs font-bold uppercase tracking-widest text-ink/60">
          <button 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'explore' }))}
            className={cn("transition-colors", state.activeTab === 'explore' ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary")}
          >
            Explore
          </button>
          <button 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'saved' }))}
            className={cn("transition-colors", state.activeTab === 'saved' ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary")}
          >
            Saved
          </button>
          <button 
            onClick={() => setState(prev => ({ ...prev, activeTab: 'suggestions' }))}
            className={cn("transition-colors", state.activeTab === 'suggestions' ? "text-primary border-b-2 border-primary pb-1" : "hover:text-primary")}
          >
            Suggestions
          </button>
        </nav>
      </header>

      <div className="flex-1 flex overflow-hidden">
        {state.activeTab === 'explore' ? (
          <>
            {/* Sidebar - Desktop */}
            <div className="hidden md:block w-[320px] flex-shrink-0 bg-white border-r border-border shadow-xl z-20">
              <Sidebar
                places={state.places}
                onSelectPlace={handleSelectPlace}
                selectedPlaceId={state.selectedPlace?.id}
                filter={state.filter}
                setFilter={(filter) => setState(prev => ({ ...prev, filter }))}
                searchQuery={state.searchQuery}
                setSearchQuery={(q) => setState(prev => ({ ...prev, searchQuery: q }))}
                onNearMe={handleNearMe}
              />
            </div>

            {/* Main Content (Map) */}
            <main className="flex-1 relative">
              <TravelMap
                places={state.places}
                selectedPlace={state.selectedPlace}
                onSelectPlace={handleSelectPlace}
                userLocation={state.userLocation}
                onNearMe={handleNearMe}
              />

              {/* Floating Detail Panel (Mobile/Desktop) */}
              <DetailPanel
                place={state.selectedPlace}
                onClose={() => setState(prev => ({ ...prev, selectedPlace: null }))}
                onShowFullInfo={() => setState(prev => ({ ...prev, fullViewPlace: prev.selectedPlace }))}
                isSaved={state.selectedPlace ? state.savedPlaceIds.includes(state.selectedPlace.id) : false}
                onToggleSave={() => state.selectedPlace && handleToggleSave(state.selectedPlace.id)}
              />
            </main>
          </>
        ) : state.activeTab === 'saved' ? (
          <div className="flex-1 overflow-y-auto p-12 bg-surface">
            <h2 className="text-4xl font-serif font-bold text-ink mb-12 italic">Your Saved Places</h2>
            {savedPlaces.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {savedPlaces.map(place => (
                  <div key={place.id} className="bg-white rounded-3xl overflow-hidden border border-border shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => setState(prev => ({ ...prev, fullViewPlace: place }))}>
                    <div className="h-48 overflow-hidden relative">
                      <img src={place.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                      <button 
                        onClick={(e) => { e.stopPropagation(); handleToggleSave(place.id); }}
                        className="absolute top-4 right-4 w-10 h-10 bg-white rounded-full flex items-center justify-center text-accent shadow-lg"
                      >
                        <Heart size={18} fill="currentColor" />
                      </button>
                    </div>
                    <div className="p-6">
                      <span className="text-[10px] uppercase font-bold text-primary tracking-widest">{place.category}</span>
                      <h3 className="text-xl font-serif font-bold text-ink mb-2">{place.name}</h3>
                      <p className="text-xs text-neutral-500 line-clamp-2">{place.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-neutral-500 font-serif italic text-xl">You haven't saved any places yet.</p>
                <button onClick={() => setState(prev => ({ ...prev, activeTab: 'explore' }))} className="mt-4 text-primary font-bold uppercase tracking-widest text-xs border-b border-primary">Start Exploring</button>
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-y-auto p-12 bg-surface">
             {/* Simple Suggestion View implemented inline for now */}
             <TravelSuggestions places={state.places} onSelectPlace={(p) => setState(prev => ({ ...prev, fullViewPlace: p }))} />
          </div>
        )}
      </div>
    </div>
  );
}


