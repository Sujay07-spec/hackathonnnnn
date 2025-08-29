import React, { useState, useMemo } from 'react';
import { Plus, Filter, Search, Zap, Cpu, Wifi, Activity, Code, Calendar, Video, Building } from 'lucide-react';
import { Event, TodoItem, FilterOptions } from '../types';
import { EventCard } from './EventCard';
import { updateEventStatus } from '../utils/dateUtils';

interface DashboardProps {
  events: Event[];
  todos: TodoItem[];
  onAddEvent: () => void;
  onEditEvent: (event: Event) => void;
  onDeleteEvent: (id: string) => void;
  onViewEvent: (event: Event) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  events,
  todos,
  onAddEvent,
  onEditEvent,
  onDeleteEvent,
  onViewEvent,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    type: 'all',
    sortBy: 'date',
    sortOrder: 'asc',
  });
  const [activeCategory, setActiveCategory] = useState<string>('all');

  const categoryConfig = {
    all: { label: 'All Categories', icon: Zap, color: 'cyan', count: 0 },
    hackathon: { label: 'Hackathons', icon: Code, color: 'emerald', count: 0 },
    event: { label: 'Events', icon: Calendar, color: 'blue', count: 0 },
    webinar: { label: 'Webinars', icon: Video, color: 'purple', count: 0 },
    government: { label: 'Government', icon: Building, color: 'amber', count: 0 },
  };

  // Calculate category counts
  const categoryCounts = useMemo(() => {
    const counts = { ...categoryConfig };
    events.forEach(event => {
      if (counts[event.type]) {
        counts[event.type].count++;
      }
    });
    counts.all.count = events.length;
    return counts;
  }, [events]);

  const filteredAndSortedEvents = useMemo(() => {
    let filtered = events
      .map(updateEventStatus)
      .filter(event => {
        const matchesSearch = event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.topics.some(topic => topic.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesStatus = filters.status === 'all' || event.status === filters.status;
        const matchesType = activeCategory === 'all' || event.type === activeCategory;
        
        return matchesSearch && matchesStatus && matchesType;
      });

    filtered.sort((a, b) => {
      let comparison = 0;
      
      switch (filters.sortBy) {
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'created':
          comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
          break;
      }
      
      return filters.sortOrder === 'desc' ? -comparison : comparison;
    });

    return filtered;
  }, [events, searchTerm, filters, activeCategory]);

  const getEventStats = () => {
    const updated = events.map(updateEventStatus);
    return {
      total: updated.length,
      upcoming: updated.filter(e => e.status === 'upcoming').length,
      live: updated.filter(e => e.status === 'live').length,
      ongoing: updated.filter(e => e.status === 'ongoing').length,
      ended: updated.filter(e => e.status === 'ended').length,
    };
  };

  const stats = getEventStats();

  const getTodoStats = (eventId: string) => {
    const eventTodos = todos.filter(todo => todo.eventId === eventId);
    return {
      total: eventTodos.length,
      completed: eventTodos.filter(todo => todo.completed).length,
    };
  };

  return (
    <div className="min-h-screen bg-slate-900 circuit-bg relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 tech-grid opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
        <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 data-stream"></div>
      </div>
      
      <div className="relative z-10 max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="relative">
              <div className="absolute inset-0 bg-cyan-400 rounded-xl blur-lg opacity-50 pulse-ring"></div>
              <div className="relative p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl border border-cyan-400/30 neon-glow">
                <Cpu size={40} className="text-cyan-400" />
              </div>
            </div>
            <div>
              <h1 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-tech neon-text">
                MANAGEMENT SYSTEM
              </h1>
              <div className="text-lg text-slate-300 font-medium tracking-wider">
                EVENT TRACKING PLATFORM
              </div>
            </div>
          </div>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto">
            Advanced monitoring and management for all types of events and initiatives
          </p>
        </div>

        {/* Category Filter Buttons */}
        <div className="mb-8">
          <div className="glass-card rounded-xl p-6 border border-cyan-400/20">
            <h3 className="text-lg font-bold text-cyan-400 mb-4 font-tech uppercase tracking-wider flex items-center gap-2">
              <Filter size={20} />
              Category Filters
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {Object.entries(categoryCounts).map(([key, config]) => {
                const Icon = config.icon;
                const isActive = activeCategory === key;
                const colorClasses = {
                  cyan: {
                    active: 'from-cyan-500 to-blue-600 text-slate-900 shadow-cyan-400/25 neon-glow',
                    inactive: 'border-cyan-400/30 text-cyan-400 hover:bg-cyan-400/10',
                  },
                  emerald: {
                    active: 'from-emerald-500 to-green-600 text-slate-900 shadow-emerald-400/25 neon-glow-green',
                    inactive: 'border-emerald-400/30 text-emerald-400 hover:bg-emerald-400/10',
                  },
                  blue: {
                    active: 'from-blue-500 to-indigo-600 text-slate-900 shadow-blue-400/25',
                    inactive: 'border-blue-400/30 text-blue-400 hover:bg-blue-400/10',
                  },
                  purple: {
                    active: 'from-purple-500 to-violet-600 text-slate-900 shadow-purple-400/25 neon-glow-purple',
                    inactive: 'border-purple-400/30 text-purple-400 hover:bg-purple-400/10',
                  },
                  amber: {
                    active: 'from-amber-500 to-orange-600 text-slate-900 shadow-amber-400/25',
                    inactive: 'border-amber-400/30 text-amber-400 hover:bg-amber-400/10',
                  },
                };
                
                return (
                  <button
                    key={key}
                    onClick={() => setActiveCategory(key)}
                    className={`p-4 rounded-lg transition-all duration-300 font-bold text-sm uppercase tracking-wider border-2 ${
                      isActive
                        ? `bg-gradient-to-r ${colorClasses[config.color as keyof typeof colorClasses].active}`
                        : `bg-slate-800/50 ${colorClasses[config.color as keyof typeof colorClasses].inactive}`
                    }`}
                  >
                    <div className="flex flex-col items-center gap-2">
                      <Icon size={20} />
                      <span className="font-tech">{config.label}</span>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isActive ? 'bg-black/20' : 'bg-slate-700'
                      }`}>
                        {config.count}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8">
          <div className="glass-card p-6 rounded-xl text-center group hover:neon-glow transition-all duration-300">
            <div className="text-3xl font-bold text-cyan-400 font-tech">{stats.total}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">Total Events</div>
            <Zap size={16} className="text-cyan-400 mx-auto mt-2 opacity-60" />
          </div>
          <div className="glass-card p-6 rounded-xl text-center group hover:neon-glow transition-all duration-300">
            <div className="text-3xl font-bold text-amber-400 font-tech">{stats.upcoming}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">Queued</div>
            <Activity size={16} className="text-amber-400 mx-auto mt-2 opacity-60" />
          </div>
          <div className="glass-card p-6 rounded-xl text-center group hover:neon-glow-green transition-all duration-300">
            <div className="text-3xl font-bold text-emerald-400 font-tech live-indicator">{stats.live}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">Active</div>
            <Wifi size={16} className="text-emerald-400 mx-auto mt-2 opacity-60" />
          </div>
          <div className="glass-card p-6 rounded-xl text-center group hover:neon-glow transition-all duration-300">
            <div className="text-3xl font-bold text-blue-400 font-tech">{stats.ongoing}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">Processing</div>
            <Cpu size={16} className="text-blue-400 mx-auto mt-2 opacity-60" />
          </div>
          <div className="glass-card p-6 rounded-xl text-center group hover:neon-glow transition-all duration-300">
            <div className="text-3xl font-bold text-slate-500 font-tech">{stats.ended}</div>
            <div className="text-slate-400 text-sm uppercase tracking-wider">Archived</div>
            <div className="w-4 h-4 bg-slate-500 rounded-sm mx-auto mt-2 opacity-60"></div>
          </div>
        </div>

        {/* Controls */}
        <div className="glass-card rounded-xl p-6 mb-8 border border-cyan-400/20">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex-1 max-w-md">
              <div className="relative group">
                <Search size={20} className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400 group-focus-within:text-cyan-300 transition-colors" />
                <input
                  type="text"
                  placeholder="Search events, topics, protocols..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-slate-800/50 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 placeholder-slate-500"
                />
                <div className="absolute inset-0 rounded-lg bg-gradient-to-r from-cyan-400/10 to-purple-400/10 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none"></div>
              </div>
            </div>

            <div className="flex gap-4 items-center">
              <div className="flex items-center gap-2">
                <Filter size={16} className="text-cyan-400" />
                <select
                  value={filters.status}
                  onChange={(e) => setFilters(prev => ({ ...prev, status: e.target.value as any }))}
                  className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-200"
                >
                  <option value="all">All Status</option>
                  <option value="upcoming">Queued</option>
                  <option value="live">Active</option>
                  <option value="ongoing">Processing</option>
                  <option value="ended">Archived</option>
                </select>
              </div>

              <select
                value={filters.type}
                onChange={(e) => setFilters(prev => ({ ...prev, type: e.target.value as any }))}
                className="px-4 py-2 bg-slate-800 border border-slate-600 rounded-lg text-sm focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 text-slate-200"
              >
                <option value="all">All Types</option>
                <option value="hackathon">Hackathons</option>
                <option value="event">Events</option>
                <option value="webinar">Webinars</option>
                <option value="government">Government</option>
              </select>

              <button
                onClick={onAddEvent}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 font-medium shadow-lg hover:shadow-cyan-400/25 neon-glow font-tech"
              >
                <Plus size={16} />
                INITIALIZE
              </button>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {filteredAndSortedEvents.length === 0 ? (
          <div className="text-center py-20">
            <div className="relative mb-8">
              <div className="absolute inset-0 bg-slate-700 rounded-full blur-xl opacity-50"></div>
              <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-slate-600">
                <Cpu size={80} className="text-slate-500 mx-auto" />
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-300 mb-4 font-tech">
              {events.length === 0 ? 'SYSTEM READY' : 'NO MATCHES FOUND'}
            </h3>
            <p className="text-slate-500 mb-8 text-lg">
              {events.length === 0 
                ? 'Initialize your first event protocol to begin tracking'
                : 'Adjust search parameters or clear filters'
              }
            </p>
            {events.length === 0 && (
              <button
                onClick={onAddEvent}
                className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-purple-500 to-cyan-500 text-white rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all duration-200 font-bold shadow-lg hover:shadow-purple-400/25 neon-glow-purple font-tech text-lg"
              >
                <Plus size={20} />
                INITIALIZE FIRST EVENT
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAndSortedEvents.map(event => {
              const todoStats = getTodoStats(event.id);
              return (
                <EventCard
                  key={event.id}
                  event={event}
                  onEdit={onEditEvent}
                  onDelete={onDeleteEvent}
                  onClick={onViewEvent}
                  todoCount={todoStats.total}
                  completedTodos={todoStats.completed}
                />
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};