import React from 'react';
import { Place } from '../types';
import { X, MapPin, Clock, Star, ArrowLeft, Globe, Share2, Heart } from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

interface FullDetailViewProps {
  place: Place;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const FullDetailView: React.FC<FullDetailViewProps> = ({ 
  place, 
  onClose,
  isSaved,
  onToggleSave
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[5000] bg-background flex flex-col overflow-y-auto"
    >
      {/* Top Header */}
      <div className="sticky top-0 w-full h-16 bg-white/80 backdrop-blur-md border-b border-border z-10 px-6 flex items-center justify-between">
        <button 
          onClick={onClose}
          className="flex items-center gap-2 text-ink hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
        >
          <ArrowLeft size={18} />
          Back to Map
        </button>
        <div className="flex gap-2">
           <button className="p-2 hover:bg-surface rounded-full transition-all text-ink">
             <Share2 size={20} />
           </button>
           <button 
            onClick={onToggleSave}
            className={cn(
              "p-2 rounded-full transition-all",
              isSaved ? "text-accent" : "text-ink hover:bg-surface"
            )}
           >
             <Heart size={20} fill={isSaved ? "currentColor" : "none"} />
           </button>
        </div>
      </div>

      {/* Hero Section */}
      <div className="relative h-[60vh] w-full flex-shrink-0">
        <img
          src={place.image || `https://picsum.photos/seed/${place.id}/1200/800`}
          alt={place.name}
          className="w-full h-full object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-ink/10 to-transparent" />
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 w-full max-w-4xl px-6">
           <span className="bg-primary text-white text-xs px-3 py-1 rounded-full font-bold uppercase tracking-widest mb-4 inline-block">
             Explore {place.category}
           </span>
           <h1 className="text-5xl md:text-7xl font-serif font-bold text-white mb-4 drop-shadow-lg">
             {place.name}
           </h1>
           <div className="flex items-center gap-6 text-white/90">
             <div className="flex items-center gap-1 font-bold">
               <Star size={20} className="text-yellow-500 fill-yellow-500" />
               <span className="text-xl">{place.rating}</span>
             </div>
             <div className="h-4 w-px bg-white/30" />
             <div className="flex items-center gap-2 text-sm font-medium">
               <MapPin size={18} className="text-primary" />
               {place.address || 'Siem Reap, Cambodia'}
             </div>
           </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-4xl mx-auto w-full px-6 py-16 grid grid-cols-1 md:grid-cols-3 gap-12">
        <div className="md:col-span-2">
          <section className="mb-12">
            <h2 className="text-2xl font-serif font-bold text-ink mb-6 italic">About this location</h2>
            <p className="text-ink/70 leading-relaxed text-lg">
              {place.description}
            </p>
            <p className="mt-4 text-ink/70 leading-relaxed text-lg">
              As one of the most iconic destinations in Cambodia, {place.name} offers a unique glimpse into the rich history and cultural heritage of the Khmer Empire. Whether you're interested in architecture, history, or simply looking for a beautiful spot to explore, this location is a must-visit in Siem Reap.
            </p>
          </section>

          <section>
             <h2 className="text-2xl font-serif font-bold text-ink mb-6 italic">Visual Highlights</h2>
             <div className="grid grid-cols-2 gap-4">
                {place.gallery && place.gallery.length > 0 ? (
                  place.gallery.map((img, idx) => (
                    <div key={idx} className="aspect-square bg-border rounded-2xl overflow-hidden">
                       <img 
                          src={img} 
                          className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" 
                          referrerPolicy="no-referrer" 
                        />
                    </div>
                  ))
                ) : (
                  <>
                    <div className="aspect-square bg-border rounded-2xl overflow-hidden">
                       <img src={`https://picsum.photos/seed/${place.id}-1/400/400`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                    <div className="aspect-square bg-border rounded-2xl overflow-hidden">
                       <img src={`https://picsum.photos/seed/${place.id}-2/400/400`} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
                    </div>
                  </>
                )}
             </div>
          </section>
        </div>

        <div>
          <div className="sticky top-24 space-y-8 min-w-[280px]">
             <div className="bg-surface border border-border p-8 rounded-3xl">
                <h3 className="font-serif text-xl font-bold text-ink mb-6 italic">Visit Details</h3>
                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-xl text-primary border border-border">
                         <Clock size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Opening Hours</p>
                         <p className="text-sm font-bold text-ink">{place.openHours || '7:30 AM - 5:30 PM'}</p>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="p-3 bg-white rounded-xl text-primary border border-border">
                         <Globe size={20} />
                      </div>
                      <div>
                         <p className="text-[10px] uppercase font-bold text-neutral-400 tracking-wider">Website</p>
                         <p className="text-sm font-bold text-ink underline decoration-primary">angkorinfo.gov.kh</p>
                      </div>
                   </div>
                </div>
                
                {place.bookingUrl && (
                  <button 
                    onClick={() => window.open(place.bookingUrl, '_blank')}
                    className="w-full mt-10 py-4 bg-ink text-white rounded-2xl font-bold uppercase tracking-widest text-xs hover:bg-primary transition-all"
                  >
                    {place.category === 'Hotel' ? 'Book a Room' : 
                     place.category === 'Activity' ? 'Book a Trip' : 
                     'Book Now'}
                  </button>
                )}
             </div>

             <div className="p-8 border border-border rounded-3xl flex flex-col items-center text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-4">
                   <Globe size={24} />
                </div>
                <h4 className="font-bold text-ink mb-2">Sustainable Tourism</h4>
                <p className="text-xs text-neutral-500">Your visit directly contributes to the conservation of this historical site.</p>
             </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
