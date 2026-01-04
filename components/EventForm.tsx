
import React, { useState } from 'react';
import { CalendarEvent } from '../types';
import { Calendar, Clock, MapPin, AlignLeft, Check, X } from 'lucide-react';

interface EventFormProps {
  initialData: CalendarEvent;
  onSave: (event: CalendarEvent) => void;
  onCancel: () => void;
}

export const EventForm: React.FC<EventFormProps> = ({ initialData, onSave, onCancel }) => {
  const [formData, setFormData] = useState<CalendarEvent>(initialData);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.date) {
      alert("Please enter a title and date.");
      return;
    }
    onSave(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-4">
        {/* Title Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase px-1">Event Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            placeholder="E.g., Dinner with Sarah"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all font-semibold text-gray-900"
            required
          />
        </div>

        {/* Date & Time Row */}
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Calendar size={12} /> Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-gray-500 uppercase px-1 flex items-center gap-1">
              <Clock size={12} /> Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
            />
          </div>
        </div>

        {/* Location Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase px-1 flex items-center gap-1">
            <MapPin size={12} /> Location
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Where is it happening?"
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm"
          />
        </div>

        {/* Description Field */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-500 uppercase px-1 flex items-center gap-1">
            <AlignLeft size={12} /> Description
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            placeholder="Any extra details..."
            rows={3}
            className="w-full px-4 py-3 bg-gray-50 border border-gray-100 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none transition-all text-sm resize-none"
          />
        </div>
      </div>

      <div className="flex gap-3 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="flex-1 px-4 py-3 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold rounded-xl transition-colors flex items-center justify-center gap-2"
        >
          <X size={18} /> Cancel
        </button>
        <button
          type="submit"
          className="flex-1 px-4 py-3 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold rounded-xl shadow-lg shadow-indigo-100 transition-all flex items-center justify-center gap-2"
        >
          <Check size={18} /> Save Event
        </button>
      </div>
    </form>
  );
};
