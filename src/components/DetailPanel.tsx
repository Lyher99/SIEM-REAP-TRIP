import React from 'react';
import { Place } from '../types';
import { X, MapPin, Clock, Star, ExternalLink, Navigation, Heart } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

interface DetailPanelProps {
  place: Place | null;
  onClose: () => void;
  onShowFullInfo: () => void;
  isSaved: boolean;
  onToggleSave: () => void;
}

export const DetailPanel: React.FC<DetailPanelProps> = ({ 
  place, 
  onClose, 
  onShowFullInfo,
  isSaved,
  onToggleSave
}) => {
  const handleGetDirection = () => {
    if (!place) return;
    const url = `https://www.google.com/maps/dir/?api=1&destination=${place.lat},${place.lng}`;
    window.open(url, '_blank');
  };

  return (
    <AnimatePresence>
      {place && (
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 50, opacity: 0 }}
          className="absolute bottom-12 left-12 w-[340px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-border z-[2000]"
        >
          <div className="h-40 bg-border relative overflow-hidden group cursor-pointer" onClick={onShowFullInfo}>
            <img
              src={place.image || `https://picsum.photos/seed/${place.id}/800/600`}
              alt={place.name}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0 bg-ink/20 group-hover:bg-ink/10 transition-colors"></div>
            <div className="absolute bottom-4 left-4">
              <span className="bg-primary text-white text-[9px] px-2 py-0.5 rounded font-bold uppercase tracking-widest">{place.category}</span>
              <h2 className="text-white font-serif text-xl italic drop-shadow-md">{place.name}</h2>
            </div>
            <div className="absolute top-4 right-4 flex gap-2 z-10">
              <button 
                onClick={(e) => { e.stopPropagation(); onToggleSave(); }}
                className={cn(
                  "w-8 h-8 rounded-full flex items-center justify-center transition-all backdrop-blur",
                  isSaved ? "bg-accent text-white" : "bg-white/20 text-white hover:bg-white/40"
                )}
              >
                <Heart size={16} fill={isSaved ? "currentColor" : "none"} />
              </button>
              <button 
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="w-8 h-8 bg-white/20 backdrop-blur rounded-full flex items-center justify-center text-white hover:bg-white/40 transition-all"
              >
                ✕
              </button>
            </div>
          </div>
          <div className="p-5">
            <div className="flex items-center gap-4 mb-4">
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-tight">Rating</span>
                  <span className="text-sm font-bold text-ink">{place.rating} ⭐</span>
               </div>
               <div className="w-px h-6 bg-border"></div>
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-tight">Status</span>
                  <span className="text-sm font-bold text-accent">Open</span>
               </div>
               <div className="w-px h-6 bg-border"></div>
               <div className="flex flex-col">
                  <span className="text-[10px] uppercase font-bold text-neutral-400 tracking-tight">Type</span>
                  <span className="text-sm font-bold text-ink">Premier</span>
               </div>
            </div>
            <p className="text-xs text-neutral-600 mb-6 leading-relaxed line-clamp-2">
              {place.description}
            </p>
            <div className="flex gap-2">
              <button 
                onClick={handleGetDirection}
                className="flex-1 py-3 bg-primary text-white rounded-xl text-xs font-heavy uppercase tracking-widest hover:bg-primary/90 transition-all"
              >
                Get Direction
              </button>
              <button 
                onClick={onShowFullInfo}
                className="w-12 h-12 flex items-center justify-center rounded-xl border border-border hover:bg-surface transition-all text-ink"
                title="Full Information"
              >
                <ExternalLink size={20} />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
