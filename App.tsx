
import React, { useState, useEffect, useMemo } from 'react';
import { CalendarEvent, ExtractedEvent } from './types';
import { extractEventFromImage } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { EventForm } from './components/EventForm';
import { EventCard } from './components/EventCard';
import { Plus, List, ArrowLeft, Loader2, Sparkles } from 'lucide-react';

const App: React.FC = () => {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [view, setView] = useState<'list' | 'upload' | 'edit'>('list');
  const [isProcessing, setIsProcessing] = useState(false);
  const [draftEvent, setDraftEvent] = useState<Partial<CalendarEvent> | null>(null);

  // Load from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('snapagenda_events');
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    localStorage.setItem('snapagenda_events', JSON.stringify(events));
  }, [events]);

  const handleImageUpload = async (base64: string) => {
    setIsProcessing(true);
    const extracted = await extractEventFromImage(base64);
    setIsProcessing(false);

    if (extracted) {
      setDraftEvent({
        ...extracted,
        id: crypto.randomUUID(),
      });
      setView('edit');
    } else {
      alert("Could not extract event details. Please try another image or enter manually.");
      setDraftEvent({
        id: crypto.randomUUID(),
        title: '',
        date: new Date().toISOString().split('T')[0],
        time: '12:00',
        location: '',
        description: ''
      });
      setView('edit');
    }
  };

  const handleSaveEvent = (event: CalendarEvent) => {
    setEvents(prev => [...prev.filter(e => e.id !== event.id), event]);
    setView('list');
    setDraftEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (confirm('Delete this event?')) {
      setEvents(prev => prev.filter(e => e.id !== id));
    }
  };

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time || '00:00'}`);
      const dateB = new Date(`${b.date}T${b.time || '00:00'}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  return (
    <div className="max-w-md mx-auto min-h-screen bg-white shadow-sm border-x border-gray-100 flex flex-col relative">
      {/* Header */}
      <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-gray-100 px-6 py-4 flex items-center justify-between">
        {view !== 'list' ? (
          <button 
            onClick={() => setView('list')}
            className="p-2 -ml-2 hover:bg-gray-100 rounded-full transition-colors text-gray-500"
          >
            <ArrowLeft size={20} />
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <img src="/a.png?v=2" alt="Logo" className="w-8 h-8 rounded-lg object-cover" />
            <h1 className="text-xl font-bold text-gray-900 tracking-tight">SnapAgenda</h1>
          </div>
        )}
        
        {view === 'list' && (
          <button 
            onClick={() => setView('upload')}
            className="bg-[#312e45] hover:bg-[#1e1c2d] text-white p-2 rounded-full transition-all active:scale-95 shadow-lg shadow-indigo-100"
          >
            <Plus size={20} />
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6">
        {isProcessing && (
          <div className="fixed inset-0 z-50 bg-white/90 backdrop-blur-sm flex flex-col items-center justify-center p-8 text-center">
            <Loader2 className="animate-spin text-indigo-600 mb-4" size={48} />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">Analyzing your image...</h2>
            <p className="text-[#312e45]">Gemini is extracting dates, times, and location details for you.</p>
          </div>
        )}

        {view === 'list' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wider">Upcoming Events</h2>
              <span className="text-xs font-medium text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                {events.length} {events.length === 1 ? 'event' : 'events'}
              </span>
            </div>
            
            {sortedEvents.length > 0 ? (
              <div className="space-y-4">
                {sortedEvents.map(event => (
                  <EventCard 
                    key={event.id} 
                    event={event} 
                    onDelete={() => handleDeleteEvent(event.id)}
                    onEdit={() => {
                      setDraftEvent(event);
                      setView('edit');
                    }}
                  />
                ))}
              </div>
            ) : (
              <div className="py-20 flex flex-col items-center justify-center text-center px-4">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <List size={48} className="text-gray-200" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-1">Your agenda is clear</h3>
                <p className="text-gray-500 max-w-xs mx-auto">
                  Snap a photo of a poster or upload a screenshot to add events instantly.
                </p>
                <button 
                  onClick={() => setView('upload')}
                  className="mt-6 text-indigo-600 font-semibold hover:text-indigo-700"
                >
                  Add your first event →
                </button>
              </div>
            )}
          </div>
        )}

        {view === 'upload' && (
          <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-300">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Add New Event</h2>
              <p className="text-gray-500">Upload a screenshot or poster to auto-fill the details.</p>
            </div>
            <ImageUploader onUpload={handleImageUpload} />
            <div className="flex items-center justify-center">
              <button 
                onClick={() => {
                  setDraftEvent({
                    id: crypto.randomUUID(),
                    title: '',
                    date: new Date().toISOString().split('T')[0],
                    time: '12:00',
                    location: '',
                    description: ''
                  });
                  setView('edit');
                }}
                className="text-gray-400 hover:text-gray-600 text-sm font-medium"
              >
                Skip upload and add manually
              </button>
            </div>
          </div>
        )}

        {view === 'edit' && draftEvent && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-300">
             <div className="mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-1">Confirm Details</h2>
              <p className="text-gray-500">We've extracted these details. Make any final tweaks below.</p>
            </div>
            <EventForm 
              initialData={draftEvent as CalendarEvent} 
              onSave={handleSaveEvent} 
              onCancel={() => setView('list')}
            />
          </div>
        )}
      </main>
    </div>
  );
};

export default App;
