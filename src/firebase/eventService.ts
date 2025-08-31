import { 
  collection, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  getDocs, 
  query, 
  orderBy,
  where,
  onSnapshot,
  Timestamp 
} from 'firebase/firestore';
import { db, auth } from './config';
import { Event, TodoItem } from '../types';
import { updateEventStatus } from '../utils/dateUtils';

const EVENTS_COLLECTION = 'events';
const TODOS_COLLECTION = 'todos';

// Event operations
export const addEventToFirestore = async (eventData: Omit<Event, 'id' | 'status' | 'createdAt'>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const eventWithStatus = updateEventStatus({ ...eventData } as Event);
    const docRef = await addDoc(collection(db, EVENTS_COLLECTION), {
      ...eventWithStatus,
      userId: user.uid,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding event:', error);
    throw error;
  }
};

export const updateEventInFirestore = async (id: string, updates: Partial<Event>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await updateDoc(eventRef, updates);
  } catch (error) {
    console.error('Error updating event:', error);
    throw error;
  }
};

export const deleteEventFromFirestore = async (id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const eventRef = doc(db, EVENTS_COLLECTION, id);
    await deleteDoc(eventRef);
    
    // Delete all todos linked to this event
    const todosQuery = query(
      collection(db, TODOS_COLLECTION),
      where('eventId', '==', id),
      where('userId', '==', user.uid)
    );
    const todosSnapshot = await getDocs(todosQuery);

    const deletePromises = todosSnapshot.docs.map(todoDoc => deleteDoc(todoDoc.ref));
    
    await Promise.all(deletePromises);

  } catch (error) {
    console.error('Error deleting event and todos:', error);
    throw error;
  }
};

export const subscribeToEvents = (callback: (events: Event[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  const q = query(
    collection(db, EVENTS_COLLECTION),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const events = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      } as Event;
    });
    callback(events);
  });
};

// Todo operations
export const addTodoToFirestore = async (todoData: Omit<TodoItem, 'id' | 'createdAt'>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const docRef = await addDoc(collection(db, TODOS_COLLECTION), {
      ...todoData,
      userId: user.uid,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } catch (error) {
    console.error('Error adding todo:', error);
    throw error;
  }
};

export const updateTodoInFirestore = async (id: string, updates: Partial<TodoItem>) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const todoRef = doc(db, TODOS_COLLECTION, id);
    await updateDoc(todoRef, updates);
  } catch (error) {
    console.error('Error updating todo:', error);
    throw error;
  }
};

export const deleteTodoFromFirestore = async (id: string) => {
  try {
    const user = auth.currentUser;
    if (!user) throw new Error('User not authenticated');
    
    const todoRef = doc(db, TODOS_COLLECTION, id);
    await deleteDoc(todoRef);
  } catch (error) {
    console.error('Error deleting todo:', error);
    throw error;
  }
};

export const subscribeToTodos = (callback: (todos: TodoItem[]) => void) => {
  const user = auth.currentUser;
  if (!user) {
    callback([]);
    return () => {};
  }
  
  const q = query(
    collection(db, TODOS_COLLECTION),
    where('userId', '==', user.uid),
    orderBy('createdAt', 'desc')
  );
  return onSnapshot(q, (snapshot) => {
    const todos = snapshot.docs.map(doc => {
      const data = doc.data();
      return {
        id: doc.id,
        ...data,
        createdAt: data.createdAt?.toDate?.()?.toISOString() ?? new Date().toISOString(),
      } as TodoItem;
    });
    callback(todos);
  });
};
