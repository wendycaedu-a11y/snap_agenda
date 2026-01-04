
export interface CalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  location: string;
  description: string;
}

export interface ExtractedEvent {
  title: string;
  date: string;
  time: string;
  location: string;
  description: string;
}
