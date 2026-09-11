import React from 'react';
import { ClerkProvider, SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import { LogIn, KeyRound } from 'lucide-react';

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

export const ClerkAuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  if (!PUBLISHABLE_KEY) {
    return <>{children}</>;
  }

  return (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY} afterSignOutUrl="/">
      {children}
    </ClerkProvider>
  );
};

export const AuthNavButton: React.FC = () => {
  if (!PUBLISHABLE_KEY) {
    return (
      <button
        onClick={() => {
          alert('Clerk Authentication setup is ready! Please paste your Clerk Publishable Key (VITE_CLERK_PUBLISHABLE_KEY) inside your .env file to activate live sign-in.');
        }}
        title="Click to activate Clerk Auth"
        className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00f0ff]/10 hover:bg-[#00f0ff] text-[#00f0ff] hover:text-[#002022] border border-[#00f0ff]/30 font-mono text-xs font-semibold transition-all duration-200 cursor-pointer shadow-[0_0_15px_rgba(0,240,255,0.15)]"
      >
        <KeyRound className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Connect Clerk</span>
        <span className="sm:hidden">Auth</span>
      </button>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <SignedIn>
        <UserButton
          appearance={{
            elements: {
              userButtonAvatarBox: 'w-8 h-8 rounded-full ring-2 ring-[#00f0ff]/60 hover:ring-[#00f0ff] transition-all',
              userButtonPopoverCard: 'bg-[#191b23] border border-white/10 text-white shadow-2xl'
            }
          }}
        />
      </SignedIn>
      <SignedOut>
        <SignInButton mode="modal">
          <button className="flex items-center gap-2 px-3.5 py-1.5 rounded-lg bg-[#00f0ff] hover:bg-[#dbfcff] text-[#002022] font-mono text-xs font-bold transition-all duration-200 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.35)]">
            <LogIn className="w-3.5 h-3.5" />
            <span>Sign In</span>
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
};
