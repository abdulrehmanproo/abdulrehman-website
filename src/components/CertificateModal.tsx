import React from 'react';
import { X, Award, CheckCircle2, ShieldCheck, Download, ExternalLink, Calendar, Hash } from 'lucide-react';
import { CERTIFICATE } from '../data/portfolioData';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CertificateModal: React.FC<CertificateModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl rounded-3xl bg-[#191b23] border border-[#00f0ff]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] p-6 sm:p-8 flex flex-col gap-6 text-[#e1e2ec] max-h-[90vh] overflow-y-auto">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full bg-[#272a32] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#32353d] transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Certificate Frame Header */}
        <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#00f0ff]/10 border border-[#00f0ff]/30 text-[#00f0ff]">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-display text-[#e1e2ec]">
                Official Credential Verification
              </h3>
              <p className="font-mono text-xs text-[#00f0ff]">
                {CERTIFICATE.organization}
              </p>
            </div>
          </div>
        </div>

        {/* Certificate Image Frame */}
        <div className="relative rounded-2xl bg-[#0b0e15] border border-[#00f0ff]/30 shadow-[0_0_30px_rgba(0,240,255,0.15)] overflow-hidden flex flex-col items-center">
          <img
            src={CERTIFICATE.imageUrl || '/images/nexskill-certificate.jpg'}
            alt="Nexskill Certificate of Completion - Abdul Rehman"
            className="w-full h-auto max-h-[60vh] object-contain rounded-xl"
          />
        </div>

        {/* Certificate Quick Info Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-4 rounded-xl bg-[#0b0e15]/80 border border-white/[0.06] text-xs font-mono">
          <div className="flex flex-col gap-1">
            <span className="text-[#849495]">AWARDED TO</span>
            <span className="text-[#e1e2ec] font-bold">Abdul Rehman</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#849495]">PROGRAM</span>
            <span className="text-[#00f0ff] font-bold">Web Development</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#849495]">ASSESSMENT</span>
            <span className="text-[#00f0ff] font-bold">Grade B+ (78%)</span>
          </div>
          <div className="flex flex-col gap-1">
            <span className="text-[#849495]">ATTENDANCE</span>
            <span className="text-[#00f0ff] font-bold">92%</span>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <a
            href={CERTIFICATE.imageUrl || '/images/nexskill-certificate.jpg'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#272a32] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#32353d] text-xs font-mono transition-colors"
          >
            <span>Open High-Res Image</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-lg bg-[#272a32] text-[#e1e2ec] text-sm font-medium hover:bg-[#32353d] transition-colors"
            >
              Close
            </button>
            <a
              href="https://wa.me/923091875679?text=Hi%20Abdul%2C%20I%20verified%20your%20Nexskill%20Web%20Development%20Certificate%20and%20would%20like%20to%20hire%20you."
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-lg bg-[#00f0ff] text-[#002022] text-sm font-semibold hover:bg-[#dbfcff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.4)]"
            >
              <span>Contact on WhatsApp</span>
              <ExternalLink className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
