import React from 'react';
import { Calendar, ExternalLink, Clock, Zap, Tag, Trash2, Edit3, Cpu, Activity } from 'lucide-react';
import { Event } from '../types';
import { formatDate } from '../utils/dateUtils';

interface EventCardProps {
  event: Event;
  onEdit: (event: Event) => void;
  onDelete: (id: string) => void;
  onClick: (event: Event) => void;
  todoCount: number;
  completedTodos: number;
}

const statusConfig = {
  upcoming: {
    colors: 'from-amber-400 to-orange-500',
    bgGlow: 'hover:shadow-amber-400/25',
    textColor: 'text-amber-400',
    icon: Clock,
    label: 'QUEUED',
  },
  live: {
    colors: 'from-emerald-400 to-green-500',
    bgGlow: 'hover:shadow-emerald-400/25',
    textColor: 'text-emerald-400',
    icon: Activity,
    label: 'ACTIVE',
  },
  ongoing: {
    colors: 'from-blue-400 to-cyan-500',
    bgGlow: 'hover:shadow-blue-400/25',
    textColor: 'text-blue-400',
    icon: Cpu,
    label: 'PROCESSING',
  },
  ended: {
    colors: 'from-slate-400 to-slate-500',
    bgGlow: 'hover:shadow-slate-400/25',
    textColor: 'text-slate-400',
    icon: Calendar,
    label: 'ARCHIVED',
  },
};

export const EventCard: React.FC<EventCardProps> = ({ 
  event, 
  onEdit, 
  onDelete, 
  onClick,
  todoCount,
  completedTodos 
}) => {
  const config = statusConfig[event.status];
  const StatusIcon = config.icon;
  const isLive = event.status === 'live';

  const handleCardClick = (e: React.MouseEvent) => {
    if (!(e.target as Element).closest('button')) {
      onClick(event);
    }
  };

  return (
    <div 
      className={`glass-card rounded-xl transition-all duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105 ${config.bgGlow} group relative overflow-hidden`}
      onClick={handleCardClick}
    >
      {/* Circuit pattern overlay */}
      <div className="absolute inset-0 circuit-pattern opacity-20"></div>
      
      {/* Hologram effect for live events */}
      {isLive && (
        <div className="absolute inset-0 hologram opacity-30"></div>
      )}

      <div className="relative p-6">
        {/* Header with status and controls */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r ${config.colors} text-black flex items-center gap-2 ${isLive ? 'live-indicator' : ''}`}>
              <StatusIcon size={12} />
              {config.label}
            </div>
            <div className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-slate-700 text-purple-400 border border-purple-400/30">
              {event.type === 'hackathon' ? 'HACK' : 'EVENT'}
            </div>
          </div>
          <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onEdit(event);
              }}
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
            >
              <Edit3 size={16} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(event.id);
              }}
              className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Event name */}
        <h3 className="text-xl font-bold text-slate-100 mb-4 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-200 font-tech">
          {event.name}
        </h3>

        {/* Event details */}
        <div className="space-y-3 mb-4">
          <div className="flex items-center gap-3 text-slate-400">
            <Calendar size={16} className="text-cyan-400" />
            <span className="text-sm font-medium">
              {formatDate(event.startDate)} → {formatDate(event.endDate)}
            </span>
          </div>

          {event.websiteLink && (
            <div className="flex items-center gap-3">
              <ExternalLink size={16} className="text-purple-400" />
              <a
                href={event.websiteLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-purple-400 hover:text-purple-300 transition-colors duration-200 truncate font-medium"
                onClick={(e) => e.stopPropagation()}
              >
                Access Portal
              </a>
            </div>
          )}

          {todoCount > 0 && (
            <div className="flex items-center gap-3 text-slate-400">
              <div className="w-4 h-4 rounded-sm bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center">
                <div className="w-2 h-2 rounded-sm bg-slate-900"></div>
              </div>
              <span className="text-sm font-medium">
                {completedTodos}/{todoCount} tasks executed
              </span>
              <div className="flex-1 bg-slate-700 rounded-full h-1.5 overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-500 transition-all duration-500"
                  style={{ width: `${todoCount > 0 ? (completedTodos / todoCount) * 100 : 0}%` }}
                ></div>
              </div>
            </div>
          )}
        </div>

        {/* Topics */}
        {event.topics.length > 0 && (
          <div className="flex items-center gap-2 mb-4">
            <Tag size={16} className="text-purple-400" />
            <div className="flex flex-wrap gap-2">
              {event.topics.slice(0, 3).map((topic, index) => (
                <span
                  key={index}
                  className="px-2 py-1 bg-slate-800 text-cyan-300 text-xs rounded border border-cyan-400/30 font-medium uppercase tracking-wide"
                >
                  {topic}
                </span>
              ))}
              {event.topics.length > 3 && (
                <span className="px-2 py-1 bg-slate-800 text-slate-400 text-xs rounded border border-slate-600 font-medium">
                  +{event.topics.length - 3}
                </span>
              )}
            </div>
          </div>
        )}

        {/* Notes */}
        {event.notes && (
          <div className="mt-4 p-3 bg-slate-800/50 rounded-lg border border-slate-600">
            <p className="text-slate-300 text-sm line-clamp-2 font-medium">
              {event.notes}
            </p>
          </div>
        )}

        {/* Animated border for live events */}
        {isLive && (
          <div className="absolute inset-0 rounded-xl">
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-cyan-400 to-emerald-400 rounded-xl opacity-50 blur-sm animate-pulse"></div>
          </div>
        )}
      </div>
    </div>
  );
};