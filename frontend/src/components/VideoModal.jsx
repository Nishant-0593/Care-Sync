import React from 'react';
import { X } from 'lucide-react';

const VideoModal = ({ isOpen, onClose, videoUrl }) => {
  if (!isOpen) return null;

  // Professional placeholder video if none provided
  const finalUrl = videoUrl || "https://www.youtube.com/embed/S_8nsh9-kQ0?autoplay=1";

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-8 animate-fade-in">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/90 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Content */}
      <div className="relative w-full max-w-5xl aspect-video bg-black rounded-[2rem] overflow-hidden shadow-2xl animate-zoom-in border border-white/10">
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 z-10 w-12 h-12 bg-white/10 hover:bg-white/20 backdrop-blur-xl rounded-full flex items-center justify-center text-white transition-all hover:scale-110 active:scale-95 border border-white/10"
        >
          <X size={28} />
        </button>
        
        <iframe
          src={finalUrl}
          title="CareSync Platform Overview"
          className="w-full h-full"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          loading="lazy"
        />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0 hover:opacity-100 transition-opacity">
          <a 
            href={finalUrl.replace('embed/', 'watch?v=')} 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-white/50 hover:text-white text-xs font-medium underline"
          >
            Video not loading? Open in YouTube
          </a>
        </div>
      </div>
    </div>
  );
};

export default VideoModal;
