import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, Zap, Settings } from 'lucide-react';
import { Event, EventType } from '../types';

interface EventFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (event: Omit<Event, 'id' | 'status' | 'createdAt'>) => void;
  editEvent?: Event;
}

export const EventForm: React.FC<EventFormProps> = ({
  isOpen,
  onClose,
  onSubmit,
  editEvent,
}) => {
  const [formData, setFormData] = useState({
    type: 'hackathon' as EventType,
    name: '',
    startDate: '',
    endDate: '',
    websiteLink: '',
    topics: [''],
    notes: '',
  });

  useEffect(() => {
    if (editEvent) {
      setFormData({
        type: editEvent.type,
        name: editEvent.name,
        startDate: editEvent.startDate,
        endDate: editEvent.endDate,
        websiteLink: editEvent.websiteLink,
        topics: editEvent.topics.length > 0 ? editEvent.topics : [''],
        notes: editEvent.notes || '',
      });
    } else {
      setFormData({
        type: 'hackathon',
        name: '',
        startDate: '',
        endDate: '',
        websiteLink: '',
        topics: [''],
        notes: '',
      });
    }
  }, [editEvent, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const filteredTopics = formData.topics.filter(topic => topic.trim() !== '');
    
    onSubmit({
      ...formData,
      topics: filteredTopics,
    });
    
    onClose();
  };

  const addTopic = () => {
    setFormData(prev => ({
      ...prev,
      topics: [...prev.topics, ''],
    }));
  };

  const removeTopic = (index: number) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.filter((_, i) => i !== index),
    }));
  };

  const updateTopic = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      topics: prev.topics.map((topic, i) => i === index ? value : topic),
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto border border-cyan-400/30">
        {/* Header */}
        <div className="sticky top-0 bg-slate-900/95 backdrop-blur-sm border-b border-cyan-400/20 px-6 py-4 rounded-t-xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-lg">
                  <option value="webinar">Webinar</option>
                  <option value="government">Government</option>
                <Settings size={20} className="text-slate-900" />
              </div>
              <h2 className="text-2xl font-bold text-cyan-400 font-tech">
                {editEvent ? 'MODIFY EVENT' : 'INITIALIZE EVENT'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="text-slate-400 hover:text-cyan-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
            >
              <X size={24} />
            </button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Type and Name */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                Protocol Type
              </label>
              <select
                value={formData.type}
                onChange={(e) => setFormData(prev => ({ ...prev, type: e.target.value as EventType }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 font-medium"
                required
              >
                <option value="hackathon">Hackathon</option>
                <option value="event">Event</option>
                <option value="webinar">Webinar</option>
                <option value="government">Government</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                Event Identifier *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 placeholder-slate-500 font-medium"
                placeholder="Enter event designation"
                required
              />
            </div>
          </div>

          {/* Date Range */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                Initialization Time *
              </label>
              <input
                type="datetime-local"
                value={formData.startDate}
                onChange={(e) => setFormData(prev => ({ ...prev, startDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
                Termination Time *
              </label>
              <input
                type="datetime-local"
                value={formData.endDate}
                onChange={(e) => setFormData(prev => ({ ...prev, endDate: e.target.value }))}
                className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 font-medium"
                required
              />
            </div>
          </div>

          {/* Website Link */}
          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              Portal Access Link
            </label>
            <input
              type="url"
              value={formData.websiteLink}
              onChange={(e) => setFormData(prev => ({ ...prev, websiteLink: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 placeholder-slate-500 font-medium"
              placeholder="https://hackathon-portal.com"
            />
          </div>

          {/* Topics */}
          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              Technology Tracks
            </label>
            <div className="space-y-3">
              {formData.topics.map((topic, index) => (
                <div key={index} className="flex gap-3">
                  <input
                    type="text"
                    value={topic}
                    onChange={(e) => updateTopic(index, e.target.value)}
                    className="flex-1 px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 placeholder-slate-500 font-medium"
                    placeholder="AI/ML, Blockchain, IoT, etc."
                  />
                  {formData.topics.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeTopic(index)}
                      className="text-red-400 hover:text-red-300 transition-colors duration-200 p-3 rounded-lg hover:bg-red-900/20 border border-red-400/30"
                    >
                      <Minus size={16} />
                    </button>
                  )}
                </div>
              ))}
              <button
                type="button"
                onClick={addTopic}
                className="flex items-center gap-2 text-purple-400 hover:text-purple-300 transition-colors duration-200 text-sm font-bold uppercase tracking-wider"
              >
                <Plus size={16} />
                Add Track
              </button>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              System Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              rows={4}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 resize-none text-slate-200 placeholder-slate-500 font-medium"
              placeholder="Add strategic notes, priorities, or mission objectives..."
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4 pt-6 border-t border-slate-700">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-6 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-200 font-bold uppercase tracking-wider"
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 font-bold shadow-lg hover:shadow-cyan-400/25 neon-glow font-tech uppercase tracking-wider"
            >
              <Zap size={16} className="inline mr-2" />
              {editEvent ? 'Update' : 'Initialize'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};