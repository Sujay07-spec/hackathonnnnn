import React, { useState } from 'react';
import { Event } from './types';
import { useAuth } from './hooks/useAuth';
import { useFirebaseEvents } from './hooks/useFirebaseEvents';
import { AuthScreen } from './components/AuthScreen';
import { Dashboard } from './components/Dashboard';
import { EventForm } from './components/EventForm';
import { EventDetail } from './components/EventDetail';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';

type View = 'dashboard' | 'event-detail';

function App() {
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | undefined>(undefined);

  const { user, loading: authLoading } = useAuth();
  const {
    events,
    todos,
    loading,
    error,
    addEvent,
    updateEvent,
    deleteEvent,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodosByEventId,
  } = useFirebaseEvents();

  // Show auth screen if user is not authenticated
  if (authLoading || !user) {
    return <AuthScreen />;
  }

  const handleAddEvent = () => {
    setEditingEvent(undefined);
    setIsEventFormOpen(true);
  };

  const handleEditEvent = (event: Event) => {
    setEditingEvent(event);
    setIsEventFormOpen(true);
  };

  const handleEventFormSubmit = async (eventData: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    try {
      if (editingEvent) {
        await updateEvent(editingEvent.id, eventData);
      } else {
        await addEvent(eventData);
      }
      setIsEventFormOpen(false);
      setEditingEvent(undefined);
    } catch (err) {
      console.error('Error saving event:', err);
      // Form will stay open so user can retry
    }
  };

  const handleViewEvent = (event: Event) => {
    setSelectedEvent(event);
    setCurrentView('event-detail');
  };

  const handleBackToDashboard = () => {
    setCurrentView('dashboard');
    setSelectedEvent(null);
  };

  const handleDeleteEvent = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event and all its tasks?')) {
      try {
        await deleteEvent(id);
      } catch (err) {
        console.error('Error deleting event:', err);
      }
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="glass-card p-8 rounded-xl text-center max-w-md">
          <h2 className="text-xl font-bold text-red-400 mb-4">System Error</h2>
          <p className="text-slate-300 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 rounded-lg font-bold"
          >
            Restart System
          </button>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
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
    </ErrorBoundary>
  );
}

export default App;