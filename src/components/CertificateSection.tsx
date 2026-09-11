import React, { useState } from 'react';
import { Award, CheckCircle2, ExternalLink, Sparkles, ShieldCheck } from 'lucide-react';
import { CERTIFICATE } from '../data/portfolioData';
import { CertificateModal } from './CertificateModal';

export const CertificateSection: React.FC = () => {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <section id="certificates" className="w-full flex flex-col gap-8 pt-8">
      {/* Section Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.06] pb-6">
        <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
          [ ACCREDITATION ]
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#e1e2ec] font-display tracking-tight">
          Certificates &amp; Vocational Training
        </h2>
      </div>

      {/* Interactive 3D Card for NAVTTC Certificate */}
      <div
        onClick={() => setModalOpen(true)}
        className="w-full max-w-4xl mx-auto rounded-3xl bg-[#272a32] border border-white/[0.08] p-6 sm:p-10 shadow-[0_0_35px_rgba(0,240,255,0.15)] backdrop-blur-xl relative overflow-hidden group hover:border-[#00f0ff]/50 hover:shadow-[0_0_50px_rgba(0,240,255,0.3)] transition-all duration-500 cursor-pointer"
      >
        {/* Glow ambient accent */}
        <div className="absolute top-0 right-0 -mr-20 -mt-20 w-64 h-64 bg-[#00f0ff]/10 rounded-full blur-3xl pointer-events-none group-hover:bg-[#00f0ff]/20 transition-all duration-500" />

        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8 relative z-10">
          <div className="flex flex-col gap-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0b0e15] border border-white/[0.06] w-fit">
              <CheckCircle2 className="w-4 h-4 text-[#00f0ff]" />
              <span className="font-mono text-xs text-[#00f0ff] font-semibold">
                {CERTIFICATE.status}
              </span>
            </div>

            <h3 className="text-2xl sm:text-3xl font-bold text-[#e1e2ec] font-display group-hover:text-[#00f0ff] transition-colors">
              {CERTIFICATE.title}
            </h3>

            <p className="text-base sm:text-lg font-medium text-[#d0bcff]">
              {CERTIFICATE.organization} ({CERTIFICATE.year})
            </p>

            <p className="text-sm sm:text-base text-[#b9cacb] max-w-xl leading-relaxed">
              {CERTIFICATE.description}
            </p>

            <div className="pt-2 flex items-center gap-2 text-xs font-mono text-[#00f0ff] group-hover:underline">
              <span>Click to examine verified digital certificate</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Certificate Image Preview Block */}
          <div className="shrink-0 w-full md:w-64 flex flex-col items-center gap-3">
            <div className="w-full h-44 sm:h-48 rounded-2xl overflow-hidden relative bg-[#0b0e15] border border-white/[0.1] shadow-lg group-hover:border-[#00f0ff]/50 transition-all">
              <img
                src={CERTIFICATE.imageUrl || '/images/nexskill-certificate.jpg'}
                alt="Nexskill Web Development Certificate - Abdul Rehman"
                className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e15]/90 via-transparent to-transparent flex items-end p-3">
                <div className="flex items-center justify-between w-full">
                  <span className="font-mono text-xs text-[#00f0ff] font-semibold flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5" />
                    <span>NEXSKILL {CERTIFICATE.year}</span>
                  </span>
                  <span className="font-mono text-[10px] bg-[#00f0ff]/20 text-[#00f0ff] px-2 py-0.5 rounded border border-[#00f0ff]/30">
                    VERIFIED
                  </span>
                </div>
              </div>
            </div>
            <div className="px-3 py-1 bg-[#0b0e15] rounded-full font-mono text-xs text-[#849495] border border-white/[0.06] flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-[#00f0ff]" />
              <span>Click to view original document</span>
            </div>
          </div>
        </div>
      </div>

      {/* Modal Dialog */}
      <CertificateModal isOpen={modalOpen} onClose={() => setModalOpen(false)} />
    </section>
  );
};
