"use client";

import { useState, useEffect } from 'react';
import { Calendar as BigCalendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, startOfWeek, getDay } from 'date-fns';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { enUS } from 'date-fns/locale';
import { Modal } from '@/components/ui/modal';

// Initialize the localizer with date-fns
const localizer = dateFnsLocalizer({
  format: (date, formatString) => format(date, formatString, { locale: enUS }),
  parse: (value, formatString) => new Date(value),
  startOfWeek: () => startOfWeek(new Date(), { locale: enUS }),
  getDay: (date) => getDay(date),
  locales: {
    'en-US': enUS,
  },
});

export default function CalendarPage() {
  const [strategies, setStrategies] = useState([]);
  const [events, setEvents] = useState([]);
  const [view, setView] = useState(Views.MONTH); // Set default view to month
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isLoading, setIsLoading] = useState(true); // Loading state

  useEffect(() => {
    const fetchStrategies = async () => {
      setIsLoading(true); // Set loading to true before fetching data
      try {
        const res = await fetch('/api/strategy');
        const data = await res.json();
        setStrategies(data);
      } catch (error) {
        console.error('Failed to fetch strategies:', error);
      } finally {
        setIsLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchStrategies();
  }, []);

  useEffect(() => {
    const mapStrategiesToEvents = () => {
      const formattedEvents = strategies.flatMap((strategy) =>
        strategy.days.map((day) => {
          const year = new Date().getFullYear();
          const monthMapping = {
            January: 1, February: 2, March: 3, April: 4,
            May: 5, June: 6, July: 7, August: 8,
            September: 9, October: 10, November: 11, December: 12
          };
          const monthNumber = monthMapping[strategy.month];
          // Format date as MM/DD/YYYY
          const formattedDate = `${String(monthNumber).padStart(2, '0')}/${String(day.day).padStart(2, '0')}/${year}`;
          const newdate = new Date(formattedDate);
          const eventDate = new Date(newdate);
          if (isNaN(eventDate.getTime())) {
            console.error(`Invalid date: ${newdate}`);
            return null;
          }
          return {
            id: strategy._id, // Use _id to ensure it's unique
            title: `${strategy.type} ${" "} ${day.post}`, // Changed from strategy.days[date] to day.post
            start: eventDate,
            end: eventDate,
            allDay: true,
            completed: day.completed // Add completed field
          };
        })
      ).filter(Boolean); // filter out null values
      setEvents(formattedEvents);
    };
    if (!isLoading) {
      mapStrategiesToEvents();
    }
  }, [strategies, isLoading]);

  const handleSelectSlot = async (slotInfo) => {
    // Handle slot selection if needed
  };

  const handleSelectEvent = (event) => {
    console.log('event:', event);
    setSelectedEvent(event);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedEvent(null);
  };

  const handleUpdateEvent = async (updatedEvent) => {
    try {
      // PATCH request to update the event on the server
      const res = await fetch(`/api/events/${updatedEvent.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedEvent),
      });

      if (!res.ok) {
        throw new Error('Failed to update event');
      }

      // Update the local state with the updated event
      setEvents(events.map(event =>
        event.id === updatedEvent.id ? updatedEvent : event
      ));
    } catch (error) {
      console.error('Failed to update event:', error);
    } finally {
      handleCloseModal();
    }
  };

  const handleViewChange = (newView) => {
    setView(newView);
  };

  // Function to customize event styles
  const eventStyleGetter = (event) => {
    const backgroundColor = event.completed ? '#d1e7dd' : '#fff'; // Green for completed, white for not completed
    return {
      style: {
        backgroundColor,
        borderRadius: '0px',
        opacity: 0.8,
        color: 'black',
        border: 'none',
      },
    };
  };

  return (
    <div className="flex flex-col h-screen p-4 max-w-screen-xl">
      <h2 className="text-2xl font-semibold mb-4">Calendar</h2>
      <div className="flex-1 overflow-auto max-w-full mx-auto relative">
        {isLoading ? (
          <div className="flex items-center justify-center h-full">
            <div className="spinner-border animate-spin inline-block w-12 h-12 border-4 rounded-full border-blue-600" role="status">
              <span className="visually-hidden text-xl">😵‍💫</span>
            </div>
          </div>
        ) : (
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            onSelectEvent={handleSelectEvent}
            onSelectSlot={handleSelectSlot}
            selectable
            view={view} // Set the current view
            onView={handleViewChange} // Optional: Use this to sync view changes
            style={{ height: '100%' }} // Set height to 100% for responsiveness
            eventPropGetter={eventStyleGetter} // Apply custom styles
          />
        )}
        {selectedEvent && (
          <Modal
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            event={selectedEvent}
            onUpdateEvent={handleUpdateEvent}
          />
        )}
      </div>
    </div>
  );
}
