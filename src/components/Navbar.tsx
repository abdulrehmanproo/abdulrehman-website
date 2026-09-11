import React, { useState, useEffect } from 'react';
import { Menu, X, Shield } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { AuthNavButton } from './ClerkWrapper';
import { useAdmin } from '../context/AdminContext';

interface NavbarProps {
  activeSection: string;
}

export const Navbar: React.FC<NavbarProps> = ({ activeSection }) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isAdmin, openAdminModal, toggleAdminOverride } = useAdmin();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { label: 'About', href: '#about', id: 'about' },
    { label: 'Skills', href: '#skills', id: 'skills' },
    { label: 'Certificates', href: '#certificates', id: 'certificates' },
    { label: 'Showcase', href: '#showcase', id: 'showcase' },
    { label: 'Contact', href: '#contact', id: 'contact' },
  ];

  return (
    <header
      id="main-navbar"
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0b0e15]/85 backdrop-blur-xl border-b border-white/[0.08] shadow-[0_4px_24px_rgba(0,0,0,0.5)]'
          : 'bg-[#0b0e15]/70 backdrop-blur-md border-b border-transparent'
      }`}
    >
      <div className="h-20 max-w-[1200px] mx-auto px-4 md:px-8 flex items-center justify-between gap-4">
        {/* Brand & Availability */}
        <div className="flex items-center gap-4 lg:gap-6">
          <div
            onDoubleClick={toggleAdminOverride}
            title="Double-click to toggle Admin Console"
            className="flex items-center gap-2.5 group transition-transform duration-200 hover:scale-[1.02] cursor-pointer"
          >
            <span className="font-semibold text-lg md:text-xl tracking-tight text-[#e1e2ec] group-hover:text-[#00f0ff] transition-colors font-display">
              {PERSONAL_INFO.name}
            </span>
          </div>


          <div className="hidden xl:flex items-center gap-2 px-3 py-1 rounded-full bg-[#191b23] border border-white/[0.06]">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
            <span className="font-mono text-[11px] text-[#b9cacb] uppercase tracking-wider font-medium">
              Available for Freelance
            </span>
          </div>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-6 lg:gap-8">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                className={`text-sm font-medium transition-all duration-200 relative py-1 ${
                  isActive
                    ? 'text-[#00f0ff] font-semibold drop-shadow-[0_0_8px_rgba(0,240,255,0.4)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ec]'
                }`}
              >
                {item.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-[2px] bg-[#00f0ff] rounded-full shadow-[0_0_8px_#00f0ff]" />
                )}
              </a>
            );
          })}
        </nav>

        {/* Right Actions: Clerk Auth, Admin Controls (only for arainbranded83@gmail.com) & Mobile Hamburger */}
        <div className="flex items-center gap-2.5">
          {/* Admin Mode Badge: only renders when logged in as arainbranded83@gmail.com */}
          {isAdmin && (
            <button
              onClick={openAdminModal}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#00f0ff]/15 border border-[#00f0ff]/50 text-[#00f0ff] hover:bg-[#00f0ff] hover:text-[#002022] transition-all font-mono text-xs font-bold shadow-[0_0_15px_rgba(0,240,255,0.3)] cursor-pointer animate-in fade-in"
              title="Open Admin Dashboard"
            >
              <Shield className="w-3.5 h-3.5" />
              <span>Admin Panel</span>
            </button>
          )}

          {/* Clerk Auth Button */}
          <AuthNavButton />

          {/* Mobile hamburger menu toggle */}
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 rounded-lg bg-[#191b23] border border-white/[0.08] text-[#b9cacb] hover:text-[#00f0ff] transition-colors"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden border-b border-white/[0.08] bg-[#0b0e15]/95 backdrop-blur-2xl px-6 py-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-4 duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
            <div className="flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
              </span>
              <span className="font-mono text-xs text-[#00f0ff]">Available for Freelance</span>
            </div>
            <div className="flex items-center gap-2">
              {isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    openAdminModal();
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[#00f0ff]/20 text-[#00f0ff] text-xs font-mono font-bold"
                >
                  Admin
                </button>
              )}
              <AuthNavButton />
            </div>
          </div>


          <div className="flex flex-col gap-2">
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`px-3 py-2 rounded-lg text-base font-medium transition-colors ${
                  activeSection === item.id
                    ? 'bg-[#191b23] text-[#00f0ff] font-semibold'
                    : 'text-[#b9cacb] hover:bg-[#191b23]/50 hover:text-[#e1e2ec]'
                }`}
              >
                {item.label}
              </a>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
