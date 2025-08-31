import React, { useState } from 'react';
import { Chrome, Cpu, Zap, User, Shield, Sparkles } from 'lucide-react';
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
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsAuthenticating(true);
      await signInWithGoogle();
    } catch (err) {
      // Error is handled by the hook
    } finally {
      setIsAuthenticating(false);
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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 circuit-bg opacity-30"></div>
        <div className="absolute inset-0 tech-grid opacity-10"></div>
        
        {/* Floating particles */}
        <div className="absolute top-20 left-20 w-2 h-2 bg-cyan-400 rounded-full animate-pulse opacity-60"></div>
        <div className="absolute top-40 right-32 w-1 h-1 bg-purple-400 rounded-full animate-pulse opacity-40 animation-delay-1000"></div>
        <div className="absolute bottom-32 left-1/4 w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse opacity-50 animation-delay-2000"></div>
        <div className="absolute bottom-20 right-20 w-1 h-1 bg-amber-400 rounded-full animate-pulse opacity-30 animation-delay-3000"></div>
        
        {/* Gradient overlays */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-cyan-500/5 via-transparent to-purple-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/50 via-transparent to-slate-900/30"></div>
      </div>
      
      {/* Animated top border */}
      <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-cyan-400 via-blue-500 via-purple-500 to-emerald-400">
        {isAuthenticating && (
          <div className="h-full bg-gradient-to-r from-transparent via-white to-transparent opacity-80 data-stream"></div>
        )}
      </div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen p-4">
        <div className="text-center max-w-lg w-full">
          {/* Logo and Branding */}
          <div className="mb-12">
            <div className="relative mb-8">
              {/* Outer glow ring */}
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-purple-500 rounded-full blur-2xl opacity-30 pulse-ring"></div>
              
              {/* Logo container */}
              <div className="relative p-8 bg-gradient-to-br from-slate-800/90 to-slate-900/90 rounded-full border-2 border-cyan-400/40 neon-glow backdrop-blur-sm">
                <div className="relative">
                  <Cpu size={80} className="text-cyan-400 mx-auto" />
                  <div className="absolute -top-2 -right-2 p-1 bg-gradient-to-r from-emerald-400 to-green-500 rounded-full">
                    <Sparkles size={16} className="text-slate-900" />
                  </div>
                </div>
              </div>
            </div>
            
            <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-emerald-400 font-tech neon-text mb-4 tracking-wider">
              MANAGEMENT
            </h1>
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 via-cyan-400 to-blue-400 font-tech mb-6 tracking-widest">
              SYSTEM
            </h2>
            <div className="flex items-center justify-center gap-2 text-slate-400 text-lg font-medium mb-2">
              <Shield size={20} className="text-cyan-400" />
              <span>Secure Event Tracking Platform</span>
            </div>
            <p className="text-slate-500 text-sm uppercase tracking-wider">
              Advanced Protocol Management Interface
            </p>
          </div>

          {/* Authentication Card */}
          <div className="glass-card rounded-2xl p-8 border border-cyan-400/30 backdrop-blur-xl">
            {error && (
              <div className="mb-6 p-4 bg-red-900/30 border border-red-400/40 rounded-xl backdrop-blur-sm">
                <p className="text-red-300 text-sm font-medium flex items-center gap-2">
                  <Shield size={16} />
                  {error}
                </p>
              </div>
            )}

            <div className="mb-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-3 font-tech uppercase tracking-wider">
                System Access Required
              </h3>
              <p className="text-slate-400 text-lg">
                Authenticate to access your personal command center
              </p>
            </div>

            <button
              onClick={handleGoogleSignIn}
              disabled={isAuthenticating}
              className={`w-full group relative overflow-hidden rounded-xl transition-all duration-500 ${
                isAuthenticating 
                  ? 'bg-gradient-to-r from-cyan-500 via-blue-500 via-purple-500 to-emerald-500 animate-pulse' 
                  : 'bg-white hover:bg-gray-50'
              } shadow-2xl hover:shadow-cyan-400/25 transform hover:scale-105 active:scale-95`}
            >
              {/* Animated background for authenticating state */}
              {isAuthenticating && (
                <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-400 via-purple-400 to-emerald-400 opacity-80">
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent data-stream"></div>
                </div>
              )}
              
              <div className="relative flex items-center justify-center gap-4 px-8 py-5">
                {isAuthenticating ? (
                  <>
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                      <Chrome size={24} className="text-white animate-pulse" />
                    </div>
                    <span className="font-tech text-white font-bold text-lg uppercase tracking-wider">
                      Authenticating...
                    </span>
                  </>
                ) : (
                  <>
                    <div className="flex items-center gap-3">
                      <Chrome size={24} className="text-blue-500 group-hover:scale-110 transition-transform duration-200" />
                      <Shield size={20} className="text-slate-600 group-hover:text-slate-700 transition-colors duration-200" />
                    </div>
                    <span className="font-tech text-slate-900 font-bold text-lg uppercase tracking-wider group-hover:text-slate-800 transition-colors duration-200">
                      Authenticate with Google
                    </span>
                  </>
                )}
              </div>
            </button>

            {/* Security badges */}
            <div className="mt-8 flex items-center justify-center gap-6 text-slate-500 text-sm">
              <div className="flex items-center gap-2">
                <Shield size={16} className="text-cyan-400" />
                <span className="font-medium">Secure</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Zap size={16} className="text-purple-400" />
                <span className="font-medium">Fast</span>
              </div>
              <div className="w-1 h-1 bg-slate-600 rounded-full"></div>
              <div className="flex items-center gap-2">
                <Sparkles size={16} className="text-emerald-400" />
                <span className="font-medium">Reliable</span>
              </div>
            </div>

            <div className="mt-6 text-center">
              <p className="text-slate-500 text-sm">
                Powered by Firebase Authentication
              </p>
            </div>
          </div>

          {/* Decorative elements */}
          <div className="mt-12 flex items-center justify-center gap-8 opacity-30">
            <div className="w-12 h-0.5 bg-gradient-to-r from-transparent to-cyan-400"></div>
            <Cpu size={24} className="text-cyan-400" />
            <div className="w-12 h-0.5 bg-gradient-to-r from-cyan-400 to-transparent"></div>
          </div>
        </div>
      </div>
    </div>
  );
};