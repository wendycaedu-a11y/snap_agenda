
import React from 'react';
import { CalendarEvent } from '../types';
import { MapPin, Clock, MoreVertical, Edit2, Trash2 } from 'lucide-react';

interface EventCardProps {
  event: CalendarEvent;
  onEdit: () => void;
  onDelete: () => void;
}

export const EventCard: React.FC<EventCardProps> = ({ event, onEdit, onDelete }) => {
  const dateObj = new Date(event.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { 
    weekday: 'short', 
    month: 'short', 
    day: 'numeric' 
  });

  return (
    <div className="group relative bg-white border border-gray-100 rounded-2xl p-4 shadow-sm hover:shadow-md transition-all hover:border-indigo-100 active:scale-[0.99] cursor-pointer overflow-hidden" onClick={onEdit}>
      {/* Date Badge */}
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="flex flex-col items-center justify-center bg-indigo-50 text-indigo-600 px-3 py-1 rounded-xl min-w-[50px]">
             <span className="text-[10px] font-bold uppercase tracking-wider">{dateObj.toLocaleDateString('en-US', { month: 'short' })}</span>
             <span className="text-lg font-bold leading-tight">{dateObj.getDate()}</span>
          </div>
          <div>
            <h3 className="text-base font-bold text-gray-900 group-hover:text-indigo-600 transition-colors line-clamp-1">{event.title}</h3>
            <div className="flex items-center gap-3 mt-1">
               {event.time && (
                <span className="flex items-center gap-1 text-xs text-gray-500">
                  <Clock size={12} className="text-gray-400" /> {event.time}
                </span>
               )}
               {event.location && (
                <span className="flex items-center gap-1 text-xs text-gray-500 line-clamp-1">
                  <MapPin size={12} className="text-gray-400" /> {event.location}
                </span>
               )}
            </div>
          </div>
        </div>
        
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button 
            onClick={(e) => { e.stopPropagation(); onEdit(); }}
            className="p-1.5 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg"
          >
            <Edit2 size={16} />
          </button>
          <button 
            onClick={(e) => { e.stopPropagation(); onDelete(); }}
            className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </div>

      {event.description && (
        <p className="text-xs text-gray-400 line-clamp-2 mt-2 leading-relaxed border-t border-gray-50 pt-2">
          {event.description}
        </p>
      )}
      
      {/* Decorative side bar */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-indigo-600 rounded-r-full opacity-0 group-hover:opacity-100 transition-opacity" />
    </div>
  );
};
