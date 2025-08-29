import React, { useState } from 'react';
import { ArrowLeft, Calendar, ExternalLink, Tag, Plus, Cpu, Activity, Zap } from 'lucide-react';
import { Event, TodoItem } from '../types';
import { formatDateTime } from '../utils/dateUtils';
import { TodoList } from './TodoList';
import { TodoForm } from './TodoForm';

interface EventDetailProps {
  event: Event;
  todos: TodoItem[];
  onBack: () => void;
  onEdit: (event: Event) => void;
  onAddTodo: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
  onUpdateTodo: (id: string, updates: Partial<TodoItem>) => void;
  onDeleteTodo: (id: string) => void;
}

const statusConfig = {
  upcoming: {
    colors: 'from-amber-400 to-orange-500',
    bgColors: 'from-amber-500/20 to-orange-500/20',
    textColor: 'text-amber-400',
    label: 'QUEUED FOR EXECUTION',
  },
  live: {
    colors: 'from-emerald-400 to-green-500',
    bgColors: 'from-emerald-500/20 to-green-500/20',
    textColor: 'text-emerald-400',
    label: 'CURRENTLY ACTIVE',
  },
  ongoing: {
    colors: 'from-blue-400 to-cyan-500',
    bgColors: 'from-blue-500/20 to-cyan-500/20',
    textColor: 'text-blue-400',
    label: 'PROCESSING',
  },
  ended: {
    colors: 'from-slate-400 to-slate-500',
    bgColors: 'from-slate-500/20 to-slate-500/20',
    textColor: 'text-slate-400',
    label: 'ARCHIVED',
  },
};

export const EventDetail: React.FC<EventDetailProps> = ({
  event,
  todos,
  onBack,
  onEdit,
  onAddTodo,
  onUpdateTodo,
  onDeleteTodo,
}) => {
  const [isAddingTodo, setIsAddingTodo] = useState(false);
  const config = statusConfig[event.status];
  const isLive = event.status === 'live';

  return (
    <div className="min-h-screen bg-slate-900 circuit-bg relative overflow-hidden">
      <div className="absolute inset-0 tech-grid opacity-10"></div>
      
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
        <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 data-stream"></div>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Back Button */}
        <div className="mb-8">
          <button
            onClick={onBack}
            className="flex items-center gap-3 text-cyan-400 hover:text-cyan-300 transition-colors duration-200 font-bold uppercase tracking-wider group"
          >
            <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform duration-200" />
            Return to Command Center
          </button>
        </div>

        {/* Main Event Card */}
        <div className="glass-card rounded-xl overflow-hidden border border-cyan-400/30 mb-8">
          {/* Header */}
          <div className={`bg-gradient-to-r ${config.bgColors} px-8 py-8 border-b border-cyan-400/20 relative overflow-hidden`}>
            {isLive && <div className="absolute inset-0 hologram opacity-20"></div>}
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-6">
                <div className={`px-4 py-2 rounded-lg bg-gradient-to-r ${config.colors} text-slate-900 font-bold uppercase tracking-wider text-sm flex items-center gap-2 ${isLive ? 'live-indicator' : ''}`}>
                  {isLive ? <Activity size={16} /> : <Cpu size={16} />}
                  {config.label}
                </div>
                <button
                  onClick={() => onEdit(event)}
                  className="flex items-center gap-2 px-4 py-2 bg-slate-800/50 text-cyan-400 rounded-lg hover:bg-slate-700/50 transition-all duration-200 border border-cyan-400/30 font-bold uppercase tracking-wider"
                >
                  <Zap size={16} />
                  Modify
                </button>
              </div>
              <h1 className="text-4xl font-black text-slate-100 mb-3 font-tech neon-text">
                {event.name}
              </h1>
              <p className="text-purple-400 text-xl font-bold uppercase tracking-wider">
                {event.type === 'hackathon' ? 'HACKATHON PROTOCOL' : 'EVENT PROTOCOL'}
              </p>
            </div>
          </div>

          {/* Content */}
          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              {/* Event Details */}
              <div className="space-y-6">
                <div>
                  <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3 font-tech uppercase tracking-wider">
                    <Calendar size={20} />
                    System Parameters
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                      <label className="block text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                        Initialization
                      </label>
                      <p className="text-slate-200 font-medium">{formatDateTime(event.startDate)}</p>
                    </div>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                      <label className="block text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                        Termination
                      </label>
                      <p className="text-slate-200 font-medium">{formatDateTime(event.endDate)}</p>
                    </div>
                    {event.websiteLink && (
                      <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                        <label className="block text-xs font-bold text-purple-400 mb-2 uppercase tracking-wider">
                          Portal Access
                        </label>
                        <a
                          href={event.websiteLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-cyan-400 hover:text-cyan-300 transition-colors duration-200 flex items-center gap-2 font-medium"
                        >
                          <ExternalLink size={16} />
                          Access Event Portal
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Topics and Notes */}
              <div className="space-y-6">
                {event.topics.length > 0 && (
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 flex items-center gap-3 font-tech uppercase tracking-wider">
                      <Tag size={20} />
                      Technology Tracks
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      {event.topics.map((topic, index) => (
                        <div
                          key={index}
                          className="px-4 py-3 bg-gradient-to-r from-purple-500/20 to-cyan-500/20 text-cyan-300 rounded-lg text-sm font-bold border border-cyan-400/30 text-center uppercase tracking-wider"
                        >
                          {topic}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {event.notes && (
                  <div>
                    <h3 className="text-xl font-bold text-cyan-400 mb-4 font-tech uppercase tracking-wider">
                      Mission Notes
                    </h3>
                    <div className="p-4 bg-slate-800/50 rounded-lg border border-slate-600">
                      <p className="text-slate-300 leading-relaxed font-medium">
                        {event.notes}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Task Management Section */}
            <div className="border-t border-slate-700 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-bold text-cyan-400 font-tech uppercase tracking-wider flex items-center gap-3">
                  <Cpu size={24} />
                  Task Execution Queue
                </h3>
                <button
                  onClick={() => setIsAddingTodo(true)}
                  className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-900 rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all duration-200 font-bold shadow-lg hover:shadow-purple-400/25 neon-glow-purple font-tech uppercase tracking-wider"
                >
                  <Plus size={16} />
                  Add Task
                </button>
              </div>

              <TodoList
                todos={todos}
                onUpdateTodo={onUpdateTodo}
                onDeleteTodo={onDeleteTodo}
              />

              {isAddingTodo && (
                <TodoForm
                  eventId={event.id}
                  isOpen={isAddingTodo}
                  onClose={() => setIsAddingTodo(false)}
                  onSubmit={onAddTodo}
                />
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};