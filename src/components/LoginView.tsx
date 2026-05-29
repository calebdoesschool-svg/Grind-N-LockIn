import React from 'react';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { Lock } from 'lucide-react';

export default function LoginView() {
  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-surface text-on-surface p-6">
      <div className="w-full max-w-sm bg-surface-container-high border border-outline p-8 flex flex-col items-center">
        <Lock className="w-16 h-16 text-primary mb-6" />
        <h1 className="font-display-lg text-2xl uppercase mb-2">Lock-In</h1>
        <p className="text-outline text-center mb-8 uppercase font-label">Authenticating Commander...</p>
        <button
          onClick={handleLogin}
          className="w-full py-3 bg-primary text-on-primary font-bold uppercase transition hover:brightness-110 active:scale-95"
        >
          Sign in with Google
        </button>
      </div>
    </div>
  );
}
