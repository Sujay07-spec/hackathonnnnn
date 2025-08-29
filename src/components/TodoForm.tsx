import React, { useState } from 'react';
import { X, Zap, Target } from 'lucide-react';
import { TodoItem } from '../types';

interface TodoFormProps {
  eventId: string;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (todo: Omit<TodoItem, 'id' | 'createdAt'>) => void;
}

export const TodoForm: React.FC<TodoFormProps> = ({
  eventId,
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [formData, setFormData] = useState({
    title: '',
    deadline: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    onSubmit({
      eventId,
      title: formData.title,
      completed: false,
      deadline: formData.deadline || undefined,
    });
    
    setFormData({ title: '', deadline: '' });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="glass-card rounded-xl shadow-2xl max-w-md w-full border border-purple-400/30">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-purple-400/20">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gradient-to-br from-purple-400 to-cyan-500 rounded-lg">
              <Target size={20} className="text-slate-900" />
            </div>
            <h3 className="text-lg font-bold text-purple-400 font-tech uppercase tracking-wider">
              Initialize Task
            </h3>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-purple-400 transition-colors duration-200 p-2 rounded-lg hover:bg-slate-700/50"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              Task Protocol *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-slate-200 placeholder-slate-500 font-medium"
              placeholder="e.g., Register for hackathon protocol"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
              Execution Deadline
            </label>
            <input
              type="datetime-local"
              value={formData.deadline}
              onChange={(e) => setFormData(prev => ({ ...prev, deadline: e.target.value }))}
              className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all duration-200 text-slate-200 font-medium"
            />
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-3 border border-slate-600 text-slate-300 rounded-lg hover:bg-slate-700/50 transition-all duration-200 font-bold uppercase tracking-wider"
            >
              Abort
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-500 to-cyan-500 text-slate-900 rounded-lg hover:from-purple-400 hover:to-cyan-400 transition-all duration-200 font-bold shadow-lg hover:shadow-purple-400/25 neon-glow-purple font-tech uppercase tracking-wider"
            >
              <Zap size={16} className="inline mr-2" />
              Execute
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};