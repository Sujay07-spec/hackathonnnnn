import { useState, useEffect } from 'react';
import { Event, TodoItem } from '../types';
import { updateEventStatus } from '../utils/dateUtils';

const STORAGE_KEY = 'hackathon-events';
const TODOS_KEY = 'hackathon-todos';

export const useEvents = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [todos, setTodos] = useState<TodoItem[]>([]);

  useEffect(() => {
    const savedEvents = localStorage.getItem(STORAGE_KEY);
    const savedTodos = localStorage.getItem(TODOS_KEY);
    
    if (savedEvents) {
      try {
        const parsedEvents = JSON.parse(savedEvents);
        // Update statuses when loading from storage
        const updatedEvents = parsedEvents.map(updateEventStatus);
        setEvents(updatedEvents);
      } catch (error) {
        console.error('Error loading events:', error);
      }
    }

    if (savedTodos) {
      try {
        setTodos(JSON.parse(savedTodos));
      } catch (error) {
        console.error('Error loading todos:', error);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
  }, [events]);

  useEffect(() => {
    localStorage.setItem(TODOS_KEY, JSON.stringify(todos));
  }, [todos]);

  const addEvent = (event: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
    const newEvent: Event = {
      ...event,
      id: crypto.randomUUID(),
      status: updateEventStatus({ ...event } as Event).status,
      createdAt: new Date().toISOString(),
    };
    setEvents(prev => [...prev, newEvent]);
  };

  const updateEvent = (id: string, updates: Partial<Event>) => {
    setEvents(prev => prev.map(event => 
      event.id === id 
        ? updateEventStatus({ ...event, ...updates })
        : event
    ));
  };

  const deleteEvent = (id: string) => {
    setEvents(prev => prev.filter(event => event.id !== id));
    setTodos(prev => prev.filter(todo => todo.eventId !== id));
  };

  const addTodo = (todo: Omit<TodoItem, 'id' | 'createdAt'>) => {
    const newTodo: TodoItem = {
      ...todo,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    };
    setTodos(prev => [...prev, newTodo]);
  };

  const updateTodo = (id: string, updates: Partial<TodoItem>) => {
    setTodos(prev => prev.map(todo => 
      todo.id === id ? { ...todo, ...updates } : todo
    ));
  };

  const deleteTodo = (id: string) => {
    setTodos(prev => prev.filter(todo => todo.id !== id));
  };

  const getTodosByEventId = (eventId: string) => {
    return todos.filter(todo => todo.eventId === eventId);
  };

  return {
    events,
    todos,
    addEvent,
    updateEvent,
    deleteEvent,
    addTodo,
    updateTodo,
    deleteTodo,
    getTodosByEventId,
  };
};