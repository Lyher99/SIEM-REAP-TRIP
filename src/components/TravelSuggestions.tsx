import React, { useState } from 'react';
import { Place } from '../types';
import { Clock, Calendar, MapPin, ChevronRight, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface TravelSuggestionsProps {
  places: Place[];
  onSelectPlace: (place: Place) => void;
}

export const TravelSuggestions: React.FC<TravelSuggestionsProps> = ({ places, onSelectPlace }) => {
  const [days, setDays] = useState<number>(1);

  // Heuristic-based itinerary generator
  const generateItinerary = (numDays: number) => {
    const itinerary = [];
    const temples = places.filter(p => p.category === 'Temple');
    const cafes = places.filter(p => p.category === 'Cafe' || p.category === 'Restaurant');
    const activities = places.filter(p => p.category === 'Activity');

    for (let i = 1; i <= numDays; i++) {
        const dayPlan = {
            day: i,
            morning: temples[(i - 1) % temples.length],
            afternoon: temples[i % temples.length],
            evening: activities[(i - 1) % activities.length],
            break: cafes[(i - 1) % cafes.length]
        };
        itinerary.push(dayPlan);
    }
    return itinerary;
  };

  const itinerary = generateItinerary(days);

  return (
    <div className="max-w-5xl mx-auto">
      <header className="mb-12 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-widest mb-4">
          <Sparkles size={14} />
          Curated Itineraries
        </div>
        <h2 className="text-5xl font-serif font-bold text-ink mb-6 italic">Plan Your Journey</h2>
        <p className="text-neutral-500 max-w-2xl mx-auto text-lg leading-relaxed mb-10">
          Discover the perfect route through Siem Reap based on your stay duration. We've curated the most iconic experiences for you.
        </p>

        <div className="flex justify-center gap-4">
          {[1, 2, 3].map(d => (
            <button
              key={d}
              onClick={() => setDays(d)}
              className={`px-8 py-3 rounded-full font-bold uppercase tracking-widest text-xs transition-all border-2 ${
                days === d 
                  ? "bg-ink text-white border-ink scale-105 shadow-xl" 
                  : "bg-white text-ink border-border hover:border-primary"
              }`}
            >
              {d} Day{d > 1 ? 's' : ''}
            </button>
          ))}
        </div>
      </header>

      <div className="space-y-12 pb-20">
        <AnimatePresence mode="wait">
          <motion.div
            key={days}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="grid grid-cols-1 gap-12"
          >
            {itinerary.map((day) => (
              <div key={day.day} className="relative">
                <div className="flex items-center gap-4 mb-8">
                   <div className="w-12 h-12 bg-primary text-white rounded-full flex items-center justify-center font-serif text-2xl font-bold">
                     {day.day}
                   </div>
                   <h3 className="text-2xl font-serif font-bold italic text-ink">Day {day.day}: The Essence of Siem Reap</h3>
                   <div className="flex-1 h-px bg-border"></div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                   {[
                     { time: 'Morning', place: day.morning, icon: '🌅' },
                     { time: 'Break', place: day.break, icon: '☕' },
                     { time: 'Afternoon', place: day.afternoon, icon: '☀️' },
                     { time: 'Evening', place: day.evening, icon: '🌙' }
                   ].map((slot, idx) => (
                     <div 
                        key={idx} 
                        className="bg-white p-6 rounded-3xl border border-border shadow-sm hover:shadow-md transition-all group cursor-pointer flex flex-col h-full"
                        onClick={() => slot.place && onSelectPlace(slot.place)}
                     >
                        <div className="text-[10px] uppercase font-bold text-neutral-400 tracking-widest mb-2 flex items-center justify-between">
                           <span>{slot.time}</span>
                           <span className="text-lg">{slot.icon}</span>
                        </div>
                        {slot.place ? (
                          <>
                            <h4 className="font-serif text-lg font-bold text-ink mb-2 group-hover:text-primary transition-colors">{slot.place.name}</h4>
                            <p className="text-[10px] font-bold text-primary uppercase tracking-tight mb-4">{slot.place.category}</p>
                            <div className="mt-auto pt-4 flex items-center justify-between border-t border-gray-50">
                               <div className="flex items-center gap-1 text-[10px] text-neutral-500">
                                  <Clock size={12} />
                                  <span>~{slot.place.visitDuration || 2}h</span>
                               </div>
                               <ChevronRight size={14} className="text-primary opacity-0 group-hover:opacity-100 transition-all -translate-x-2 group-hover:translate-x-0" />
                            </div>
                          </>
                        ) : (
                          <p className="text-xs text-neutral-400 italic">Exploring more...</p>
                        )}
                     </div>
                   ))}
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="bg-ink rounded-[40px] p-12 text-center text-white relative overflow-hidden mb-20">
         <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
         <h3 className="text-3xl font-serif font-bold italic mb-4">Want a Custom Experience?</h3>
         <p className="text-white/60 mb-8 max-w-xl mx-auto">Our local experts can create a personalized journey just for you. Connect with us for more hidden gems.</p>
         <button className="px-10 py-4 bg-primary text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary/90 transition-all shadow-2xl">Contact Local Guide</button>
      </div>
    </div>
  );
};
