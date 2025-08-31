import React, { useState } from 'react';
import { User, LogOut, Settings, Edit3, Save, X } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

export const UserProfile: React.FC = () => {
  const { user, signOut, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState(user?.displayName || '');

  const handleSave = async () => {
    if (editName.trim() && editName !== user?.displayName) {
      try {
        await updateUserProfile({ displayName: editName.trim() });
        setIsEditing(false);
      } catch (err) {
        console.error('Failed to update profile:', err);
      }
    } else {
      setIsEditing(false);
    }
  };

  const handleCancel = () => {
    setEditName(user?.displayName || '');
    setIsEditing(false);
  };

  if (!user) return null;

  return (
    <div className="glass-card rounded-xl p-4 border border-cyan-400/20 flex items-center gap-4">
      <div className="flex items-center gap-3 flex-1">
        {user.photoURL ? (
          <img
            src={user.photoURL}
            alt={user.displayName}
            className="w-10 h-10 rounded-full border-2 border-cyan-400/30"
          />
        ) : (
          <div className="w-10 h-10 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-full flex items-center justify-center">
            <User size={20} className="text-slate-900" />
          </div>
        )}
        
        <div className="flex-1">
          {isEditing ? (
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={editName}
                onChange={(e) => setEditName(e.target.value)}
                className="flex-1 px-3 py-1 bg-slate-800 border border-slate-600 rounded text-slate-200 text-sm font-medium"
                placeholder="Enter your name"
              />
              <button
                onClick={handleSave}
                className="text-emerald-400 hover:text-emerald-300 transition-colors p-1"
              >
                <Save size={16} />
              </button>
              <button
                onClick={handleCancel}
                className="text-slate-400 hover:text-slate-300 transition-colors p-1"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <div>
                <p className="text-slate-200 font-bold text-sm">{user.displayName}</p>
                <p className="text-slate-400 text-xs">{user.email}</p>
              </div>
              <button
                onClick={() => setIsEditing(true)}
                className="text-slate-400 hover:text-cyan-400 transition-colors p-1"
              >
                <Edit3 size={14} />
              </button>
            </div>
          )}
        </div>
      </div>

      <button
        onClick={signOut}
        className="text-slate-400 hover:text-red-400 transition-colors duration-200 p-2 rounded-lg hover:bg-red-900/20 border border-transparent hover:border-red-400/30"
        title="Sign Out"
      >
        <LogOut size={16} />
      </button>
    </div>
  );
};