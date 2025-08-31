import React, { useState } from 'react';
import { Chrome, Cpu, Zap, User, Shield } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';

interface ProfileSetupProps {
  user: any;
  onComplete: (name: string) => void;
}

const ProfileSetup: React.FC<ProfileSetupProps> = ({ user, onComplete }) => {
  const [displayName, setDisplayName] = useState(user?.displayName || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (displayName.trim()) {
      onComplete(displayName.trim());
    }
  };

  return (
    <div className="glass-card rounded-xl p-8 max-w-md w-full border border-cyan-400/30">
      <div className="text-center mb-8">
        <div className="relative mb-6">
          <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 pulse-ring"></div>
          <div className="relative p-4 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-cyan-400/30 neon-glow">
            <User size={32} className="text-cyan-400 mx-auto" />
          </div>
        </div>
        <h2 className="text-2xl font-bold text-cyan-400 mb-2 font-tech uppercase tracking-wider">
          Profile Setup
        </h2>
        <p className="text-slate-400">Complete your system profile</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-cyan-400 mb-3 uppercase tracking-wider">
            Display Name *
          </label>
          <input
            type="text"
            value={displayName}
            onChange={(e) => setDisplayName(e.target.value)}
            className="w-full px-4 py-3 bg-slate-800 border border-slate-600 rounded-lg focus:ring-2 focus:ring-cyan-400 focus:border-cyan-400 transition-all duration-200 text-slate-200 placeholder-slate-500 font-medium"
            placeholder="Enter your name"
            required
          />
        </div>

        <button
          type="submit"
          className="w-full px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-900 rounded-lg hover:from-cyan-400 hover:to-blue-500 transition-all duration-200 font-bold shadow-lg hover:shadow-cyan-400/25 neon-glow font-tech uppercase tracking-wider"
        >
          <Zap size={16} className="inline mr-2" />
          Initialize Profile
        </button>
      </form>
    </div>
  );
};

export const AuthScreen: React.FC = () => {
  const { user, loading, error, signInWithGoogle, updateUserProfile } = useAuth();
  const [needsProfileSetup, setNeedsProfileSetup] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (err) {
      // Error is handled by the hook
    }
  };

  const handleProfileComplete = async (name: string) => {
    try {
      await updateUserProfile({ displayName: name });
      setNeedsProfileSetup(false);
    } catch (err) {
      // Error is handled by the hook
    }
  };

  // Check if user needs profile setup
  React.useEffect(() => {
    if (user && !user.displayName) {
      setNeedsProfileSetup(true);
    } else {
      setNeedsProfileSetup(false);
    }
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 circuit-bg flex items-center justify-center">
        <div className="text-center">
          <div className="relative mb-8">
            <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 pulse-ring"></div>
            <div className="relative p-8 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-cyan-400/30 neon-glow">
              <Shield size={64} className="text-cyan-400 mx-auto animate-pulse" />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-cyan-400 mb-4 font-tech uppercase tracking-wider neon-text">
            Authenticating
          </h2>
          <p className="text-slate-400 font-medium">Verifying system access...</p>
        </div>
      </div>
    );
  }

  if (user && needsProfileSetup) {
    return (
      <div className="min-h-screen bg-slate-900 circuit-bg flex items-center justify-center p-4">
        <div className="absolute inset-0 tech-grid opacity-20"></div>
        <div className="relative z-10">
          <ProfileSetup user={user} onComplete={handleProfileComplete} />
        </div>
      </div>
    );
  }

  if (user && !needsProfileSetup) {
    return null; // User is authenticated and profile is complete
  }

  return (
    <div className="min-h-screen bg-slate-900 circuit-bg flex items-center justify-center p-4">
      <div className="absolute inset-0 tech-grid opacity-20"></div>
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500">
        <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-30 data-stream"></div>
      </div>
      
      <div className="relative z-10 text-center">
        <div className="glass-card rounded-xl p-8 max-w-md w-full border border-cyan-400/30">
          <div className="mb-8">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-cyan-400 rounded-full blur-xl opacity-50 pulse-ring"></div>
              <div className="relative p-6 bg-gradient-to-br from-slate-800 to-slate-900 rounded-full border border-cyan-400/30 neon-glow">
                <Cpu size={48} className="text-cyan-400 mx-auto" />
              </div>
            </div>
            <h1 className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 font-tech neon-text mb-2">
              MANAGEMENT SYSTEM
            </h1>
            <p className="text-slate-400 text-lg font-medium">
              Secure access required
            </p>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-900/20 border border-red-400/30 rounded-lg">
              <p className="text-red-400 text-sm font-medium">{error}</p>
            </div>
          )}

          <button
            onClick={handleGoogleSignIn}
            className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-white text-slate-900 rounded-lg hover:bg-gray-100 transition-all duration-200 font-bold shadow-lg hover:shadow-white/25 group"
          >
            <Chrome size={20} className="text-blue-500" />
            <span className="font-tech uppercase tracking-wider">
              Authenticate with Google
            </span>
          </button>

          <div className="mt-6 text-center">
            <p className="text-slate-500 text-sm">
              Secure authentication powered by Firebase
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};