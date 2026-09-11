/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CyberShaderBackground } from './components/CyberShaderBackground';
import { Navbar } from './components/Navbar';
import { HeroSection } from './components/HeroSection';
import { AboutSection } from './components/AboutSection';
import { CertificateSection } from './components/CertificateSection';
import { ShowcaseSection } from './components/ShowcaseSection';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ClerkAuthProvider } from './components/ClerkWrapper';
import { recordPageView } from './lib/supabaseClient';
import { AdminProvider } from './context/AdminContext';
import { AdminDashboardModal } from './components/AdminDashboardModal';
import { AdminPage } from './components/AdminPage';

export default function App() {
  const [activeSection, setActiveSection] = useState('about');
  const [currentRoute, setCurrentRoute] = useState<'portfolio' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p === '/admin' || p.startsWith('/admin/') || h === '#admin' || h === '#/admin') {
        return 'admin';
      }
    }
    return 'portfolio';
  });

  // Listen to navigation events (popstate / hashchange)
  useEffect(() => {
    const handleLocationChange = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p === '/admin' || p.startsWith('/admin/') || h === '#admin' || h === '#/admin') {
        setCurrentRoute('admin');
      } else {
        setCurrentRoute('portfolio');
      }
    };

    window.addEventListener('popstate', handleLocationChange);
    window.addEventListener('hashchange', handleLocationChange);
    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      window.removeEventListener('hashchange', handleLocationChange);
    };
  }, []);

  const navigateToPortfolio = () => {
    try {
      window.history.pushState({}, '', '/');
      window.dispatchEvent(new Event('popstate'));
    } catch (e) {
      window.location.hash = '';
    }
    setCurrentRoute('portfolio');
  };

  // Record visitor analytics telemetry via Supabase
  useEffect(() => {
    recordPageView();
  }, []);

  // Track active section for navbar highlighting
  useEffect(() => {
    if (currentRoute !== 'portfolio') return;

    const handleScroll = () => {
      const sections = ['about', 'skills', 'certificates', 'showcase', 'contact'];
      const scrollY = window.scrollY;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop - 120;
          const height = el.offsetHeight;
          if (scrollY >= top && scrollY < top + height) {
            setActiveSection(sectionId);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [currentRoute]);

  return (
    <ClerkAuthProvider>
      <AdminProvider>
        {currentRoute === 'admin' ? (
          <AdminPage onBackToPortfolio={navigateToPortfolio} />
        ) : (
          <div className="relative min-h-screen bg-[#10131a] text-[#e1e2ec] selection:bg-[#00f0ff] selection:text-[#002022] overflow-x-hidden font-body-md antialiased">
            {/* 1. WebGL Ambient Cosmic Shader Background */}
            <CyberShaderBackground />

            {/* 2. Fixed Header Navigation */}
            <Navbar activeSection={activeSection} />

            {/* 3. Main Content Wrapper with Max Content Width */}
            <main className="relative z-10 w-full pt-20">
              <div className="max-w-[1200px] mx-auto px-4 sm:px-6 lg:px-8 py-8 flex flex-col gap-20 sm:gap-24">
                {/* Hero Section */}
                <HeroSection />

                {/* About Me & System Diagnostic & Technical Stack */}
                <AboutSection />

                {/* Certificates & Accreditation */}
                <CertificateSection />

                {/* Featured Media & Showcase (Videos, Pictures, Links managed by Admin) */}
                <ShowcaseSection />

                {/* Direct Connect Section */}
                <ContactSection />
              </div>
            </main>

            {/* 4. Footer */}
            <Footer />

            {/* 5. Fallback Admin Modal */}
            <AdminDashboardModal />
          </div>
        )}
      </AdminProvider>
    </ClerkAuthProvider>
  );
}


