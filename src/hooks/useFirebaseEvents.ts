import { useState, useEffect } from 'react';
import { Event, TodoItem } from '../types';
import { updateEventStatus } from '../utils/dateUtils';
import {
  subscribeToEvents,
  subscribeToTodos,
  addEventToFirestore,
  updateEventInFirestore,
  deleteEventFromFirestore,
  addTodoToFirestore,
  updateTodoInFirestore,
  deleteTodoFromFirestore,
} from '../firebase/eventService';

export const useFirebaseEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    
    // Subscribe to events
    const unsubscribeEvents = subscribeToEvents((eventsData) => {
      try {
        const updatedEvents = eventsData.map(updateEventStatus);
        setEvents(updatedEvents);
        setError(null);
      } catch (err) {
        console.error('Error processing events:', err);
        setError('Failed to load events');
      } finally {
        setLoading(false);
      }
    });

    // Subscribe to todos
    const unsubscribeTodos = subscribeToTodos((todosData) => {
      try {
        setTodos(todosData);
        setError(null);
      } catch (err) {
        console.error('Error processing todos:', err);
        setError('Failed to load tasks');
      }
    });

    // Cleanup subscriptions
    return () => {
      unsubscribeEvents();
      unsubscribeTodos();
    };
  }, []);

  const addEvent = async (eventData: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    try {
      await addEventToFirestore(eventData);
      setError(null);
    } catch (err) {
      console.error('Error adding event:', err);
      setError('Failed to create event');
      throw err;
    }
  };

  const updateEvent = async (id: string, updates: Partial<Event>) => {
    try {
      await updateEventInFirestore(id, updates);
      setError(null);
    } catch (err) {
      console.error('Error updating event:', err);
      setError('Failed to update event');
      throw err;
    }
  };

  const deleteEvent = async (id: string) => {
    try {
      await deleteEventFromFirestore(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting event:', err);
      setError('Failed to delete event');
      throw err;
    }
  };

  const addTodo = async (todoData: Omit<TodoItem, 'id' | 'createdAt'>) => {
    try {
      await addTodoToFirestore(todoData);
      setError(null);
    } catch (err) {
      console.error('Error adding task:', err);
      setError('Failed to create task');
      throw err;
    }
  };

  const updateTodo = async (id: string, updates: Partial<TodoItem>) => {
    try {
      await updateTodoInFirestore(id, updates);
      setError(null);
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
      throw err;
    }
  };

  const deleteTodo = async (id: string) => {
    try {
      await deleteTodoFromFirestore(id);
      setError(null);
    } catch (err) {
      console.error('Error deleting task:', err);
      setError('Failed to delete task');
      throw err;
    }
  };

  const getTodosByEventId = (eventId: string) => {
    return todos.filter(todo => todo.eventId === eventId);
  };

  return {
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
  };
};