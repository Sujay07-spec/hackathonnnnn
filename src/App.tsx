import React, { useState } from 'react';
import { Event } from './types';
import { useEvents } from './hooks/useEvents';
import { Dashboard } from './components/Dashboard';
import { EventForm } from './components/EventForm';
import { EventDetail } from './components/EventDetail';

type View = 'dashboard' | 'event-detail';

function App() {
  const {
    events,
    todos,
    addEvent,
    updateEvent,
    deleteEvent,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodosByEventId,
  } = useEvents();

  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleEventFormSubmit = (eventData: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    if (editingEvent) {
      updateEvent(editingEvent.id, eventData);
    } else {
      addEvent(eventData);
    }
    setIsEventFormOpen(false);
    setEditingEvent(undefined);
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedEvent(null);
  };

  const handleDeleteEvent = (id: string) => {
    if (window.confirm('Are you sure you want to delete this event and all its tasks?')) {
      deleteEvent(id);
    }
  };

  return (
    <div className="App">
      {currentView === 'dashboard' && (
        <Dashboard
          events={events}
          todos={todos}
          onAddEvent={handleAddEvent}
          onEditEvent={handleEditEvent}
          onDeleteEvent={handleDeleteEvent}
          onViewEvent={handleViewEvent}
        />
      )}

      {currentView === 'event-detail' && selectedEvent && (
        <EventDetail
          event={selectedEvent}
          todos={getTodosByEventId(selectedEvent.id)}
          onBack={handleBackToDashboard}
          onEdit={(event) => {
            handleEditEvent(event);
            setCurrentView('dashboard');
          }}
          onAddTodo={addTodo}
          onUpdateTodo={updateTodo}
          onDeleteTodo={deleteTodo}
        />
      )}

      <EventForm
        isOpen={isEventFormOpen}
        onClose={() => {
          setIsEventFormOpen(false);
          setEditingEvent(undefined);
        }}
        onSubmit={handleEventFormSubmit}
        editEvent={editingEvent}
      />
    </div>
  );
}

export default App;