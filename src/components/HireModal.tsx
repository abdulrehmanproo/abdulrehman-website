import React, { useState } from 'react';
import { X, MessageCircle, Mail, Sparkles, Check, ArrowRight, ShieldCheck } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';

interface HireModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const HireModal: React.FC<HireModalProps> = ({ isOpen, onClose }) => {
  const [selectedService, setSelectedService] = useState('Full Stack Web App');
  const [estimatedTimeline, setEstimatedTimeline] = useState('2-3 Weeks');

  if (!isOpen) return null;

  const services = [
    { title: 'Full Stack Web App', timeline: '2-4 Weeks', desc: 'React, Next.js, Node/Express, database persistence, REST APIs' },
    { title: 'Interactive 3D / WebGL Showcase', timeline: '1-3 Weeks', desc: 'Three.js, custom PBR shaders, interactive orbit configurations' },
    { title: 'E-Commerce Platform', timeline: '2-3 Weeks', desc: 'Stripe payments, shopping cart engine, catalog filters, inventory' },
    { title: 'UI/UX & High-Performance Frontend', timeline: '1-2 Weeks', desc: 'Tailwind CSS, responsive design tokens, WCAG AA accessibility' }
  ];

  const generateWhatsAppMessage = () => {
    const text = `Hi Abdul Rehman, I am interested in hiring you for a ${selectedService} project (Estimated timeline: ${estimatedTimeline}). Let's discuss details!`;
    return `https://wa.me/923091875679?text=${encodeURIComponent(text)}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl rounded-3xl bg-[#191b23] border border-[#00f0ff]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 sm:p-8 flex flex-col gap-6 text-[#e1e2ec] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#272a32] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#32353d] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00f0ff]"></span>
            </span>
            <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-wider font-semibold">
              Client Onboarding Portal
            </span>
          </div>
          <h3 className="text-2xl font-bold font-display text-[#e1e2ec]">
            Hire Abdul Rehman
          </h3>
          <p className="text-xs sm:text-sm text-[#b9cacb]">
            Full Stack Web Developer &amp; ICS Student based in Lahore, Pakistan. Ready for freelance, contract, or full-time engagements.
          </p>
        </div>

        {/* Service Selector */}
        <div className="flex flex-col gap-2">
          <span className="font-mono text-xs uppercase text-[#849495]">
            Select Project Archetype:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {services.map((srv) => (
              <button
                key={srv.title}
                onClick={() => {
                  setSelectedService(srv.title);
                  setEstimatedTimeline(srv.timeline);
                }}
                className={`p-3.5 rounded-xl text-left border transition-all ${
                  selectedService === srv.title
                    ? 'bg-[#272a32] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.2)]'
                    : 'bg-[#0b0e15] border-white/[0.06] hover:border-white/[0.2]'
                }`}
              >
                <div className="flex justify-between items-center mb-1">
                  <span className="font-bold text-xs text-[#e1e2ec]">{srv.title}</span>
                  {selectedService === srv.title && (
                    <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                  )}
                </div>
                <p className="text-[11px] text-[#b9cacb] leading-snug">{srv.desc}</p>
                <span className="font-mono text-[10px] text-[#00f0ff] mt-2 block">
                  Est: {srv.timeline}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Direct Action Channels */}
        <div className="flex flex-col gap-3 pt-2 border-t border-white/[0.08]">
          <a
            href={generateWhatsAppMessage()}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#00f0ff] text-[#002022] font-semibold text-sm hover:bg-[#dbfcff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
          >
            <MessageCircle className="w-4 h-4" />
            <span>Launch Direct WhatsApp Chat (+92 309 1875679)</span>
          </a>

          <a
            href={`mailto:${PERSONAL_INFO.email}?subject=Hiring Inquiry for ${encodeURIComponent(selectedService)}&body=Hi Abdul,%0D%0A%0D%0AI would like to discuss a ${encodeURIComponent(selectedService)} project with you.`}
            className="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#272a32] text-[#e1e2ec] font-mono text-xs hover:bg-[#32353d] transition-colors border border-white/[0.08]"
          >
            <Mail className="w-4 h-4 text-[#00f0ff]" />
            <span>Send Detailed Email Inquiry ({PERSONAL_INFO.email})</span>
          </a>
        </div>

        {/* Security badge */}
        <div className="flex items-center justify-center gap-2 text-center font-mono text-[11px] text-[#849495] pt-1">
          <ShieldCheck className="w-4 h-4 text-[#00f0ff]" />
          <span>Prompt 24-hour turnaround guaranteed for all client dispatches</span>
        </div>
      </div>
    </div>
  );
};
