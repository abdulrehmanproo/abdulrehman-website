import React, { createContext, useContext, useState, useEffect } from 'react';
import { useUser } from '@clerk/clerk-react';

interface AdminContextType {
  isAdmin: boolean;
  adminEmail: string | null;
  isAdminModalOpen: boolean;
  openAdminModal: () => void;
  closeAdminModal: () => void;
  openAdminPage: () => void;
  toggleAdminOverride: () => void;
}

const ADMIN_EMAIL = 'arainbranded83@gmail.com';
const STORAGE_OVERRIDE_KEY = 'ar_admin_verified';

const AdminContext = createContext<AdminContextType | undefined>(undefined);

export const AdminProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [localAdminActive, setLocalAdminActive] = useState<boolean>(() => {
    try {
      return localStorage.getItem(STORAGE_OVERRIDE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  });

  let isSignedIn = false;
  let userEmail: string | undefined;

  try {
    const clerk = useUser();
    isSignedIn = Boolean(clerk.isSignedIn);
    userEmail = clerk.user?.primaryEmailAddress?.emailAddress;

    if (!userEmail && clerk.user?.emailAddresses?.length) {
      userEmail = clerk.user.emailAddresses[0]?.emailAddress;
    }

    // Check external OAuth accounts (e.g. Google)
    if (!userEmail && (clerk.user as any)?.externalAccounts?.length) {
      userEmail = (clerk.user as any).externalAccounts[0]?.emailAddress;
    }
  } catch (e) {
    // Clerk initializing or fallback
  }

  // Check if current Clerk user matches arainbranded83@gmail.com
  const isClerkAdmin = Boolean(
    isSignedIn &&
    userEmail &&
    userEmail.trim().toLowerCase().includes('arainbranded83')
  );

  // If detected via Clerk Google login, persist state
  useEffect(() => {
    if (isClerkAdmin) {
      localStorage.setItem(STORAGE_OVERRIDE_KEY, 'true');
      setLocalAdminActive(true);
    }
  }, [isClerkAdmin]);

  // Master Admin is true if verified via Clerk Google Account or persisted admin session
  const isAdmin = isClerkAdmin || localAdminActive;

  // Secret shortcut: Ctrl + Shift + A to toggle Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        const nextState = !localAdminActive;
        setLocalAdminActive(nextState);
        localStorage.setItem(STORAGE_OVERRIDE_KEY, nextState ? 'true' : 'false');
        if (nextState) {
          setIsAdminModalOpen(true);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [localAdminActive]);

  const toggleAdminOverride = () => {
    const next = !localAdminActive;
    setLocalAdminActive(next);
    localStorage.setItem(STORAGE_OVERRIDE_KEY, next ? 'true' : 'false');
    if (next) {
      setIsAdminModalOpen(true);
    }
  };

  const openAdminPage = () => {
    try {
      window.history.pushState({}, '', '/admin');
      window.dispatchEvent(new Event('popstate'));
    } catch (e) {
      window.location.hash = 'admin';
    }
  };

  return (
    <AdminContext.Provider
      value={{
        isAdmin,
        adminEmail: isAdmin ? ADMIN_EMAIL : null,
        isAdminModalOpen,
        openAdminModal: openAdminPage,
        closeAdminModal: () => setIsAdminModalOpen(false),
        openAdminPage,
        toggleAdminOverride
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => {
  const ctx = useContext(AdminContext);
  if (!ctx) {
    throw new Error('useAdmin must be used within an AdminProvider');
  }
  return ctx;
};
