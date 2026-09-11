import React, { useState } from 'react';
import {
  Mail,
  ExternalLink,
  Phone,
  Sparkles,
  Copy,
  Check,
  Radio,
  Send,
  X,
  CheckCircle2,
  Loader2,
  Database
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TikTokIcon, GithubIcon, LinkedInIcon, WhatsAppIcon } from './SocialIcons';
import { sendContactMessage } from '../lib/supabaseClient';

export const ContactSection: React.FC = () => {
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);
  const [isInquiryOpen, setIsInquiryOpen] = useState(false);
  const [inquiryForm, setInquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [isSending, setIsSending] = useState(false);
  const [sentSuccess, setSentSuccess] = useState(false);
  const [sendError, setSendError] = useState('');

  const handleInquirySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSending(true);
    setSendError('');

    try {
      await sendContactMessage({
        name: inquiryForm.name,
        email: inquiryForm.email,
        phone: inquiryForm.phone,
        message: inquiryForm.message
      });
      setSentSuccess(true);
      setInquiryForm({ name: '', email: '', phone: '', message: '' });
      setTimeout(() => {
        setSentSuccess(false);
        setIsInquiryOpen(false);
      }, 3000);
    } catch (err: any) {
      setSendError(err?.message || 'Failed to submit message to Supabase.');
    } finally {
      setIsSending(false);
    }
  };

  const handleCopyEmail = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PERSONAL_INFO.email);
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleCopyPhone = (e: React.MouseEvent) => {
    e.preventDefault();
    navigator.clipboard.writeText(PERSONAL_INFO.phone);
    setCopiedPhone(true);
    setTimeout(() => setCopiedPhone(false), 2500);
  };

  const contactChannels = [
    {
      id: 'whatsapp',
      title: 'WhatsApp Chat',
      desc: 'Instant direct messaging & project discussions',
      value: PERSONAL_INFO.phone,
      badge: 'Fastest Response',
      href: PERSONAL_INFO.whatsappUrl,
      icon: <WhatsAppIcon className="w-6 h-6 text-[#25D366]" />,
      buttonText: 'Open WhatsApp',
      accentColor: 'border-[#25D366]/40 hover:border-[#25D366] group-hover:shadow-[0_0_30px_rgba(37,211,102,0.25)]'
    },
    {
      id: 'email',
      title: 'Email Address',
      desc: 'Send contract proposals, inquiries & technical specifications',
      value: PERSONAL_INFO.email,
      badge: 'Official Inquiries',
      href: `mailto:${PERSONAL_INFO.email}`,
      icon: <Mail className="w-6 h-6 text-[#00f0ff]" />,
      buttonText: 'Send Email',
      accentColor: 'border-[#00f0ff]/40 hover:border-[#00f0ff] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.25)]',
      copyable: true,
      copied: copiedEmail,
      onCopy: handleCopyEmail
    },
    {
      id: 'tiktok',
      title: 'TikTok Profile',
      desc: 'Coding videos, development tutorials & public updates',
      value: '@abdulrehman38762',
      badge: 'Video Content',
      href: PERSONAL_INFO.tiktok,
      icon: <TikTokIcon className="w-6 h-6 text-[#ff0050]" />,
      buttonText: 'Follow on TikTok',
      accentColor: 'border-[#ff0050]/40 hover:border-[#ff0050] group-hover:shadow-[0_0_30px_rgba(255,0,80,0.25)]'
    },
    {
      id: 'linkedin',
      title: 'LinkedIn Network',
      desc: 'Professional network, career highlights & business connections',
      value: 'in/abdulrehman2221',
      badge: 'Professional',
      href: PERSONAL_INFO.linkedin,
      icon: <LinkedInIcon className="w-6 h-6 text-[#0077b5]" />,
      buttonText: 'Connect on LinkedIn',
      accentColor: 'border-[#0077b5]/40 hover:border-[#0077b5] group-hover:shadow-[0_0_30px_rgba(0,119,181,0.25)]'
    },
    {
      id: 'github',
      title: 'GitHub Repositories',
      desc: 'Explore source code, repositories, commits & architecture',
      value: 'github.com/abdulrehmanproo',
      badge: 'Open Source',
      href: PERSONAL_INFO.github,
      icon: <GithubIcon className="w-6 h-6 text-white" />,
      buttonText: 'View GitHub Profile',
      accentColor: 'border-white/30 hover:border-white group-hover:shadow-[0_0_30px_rgba(255,255,255,0.2)]'
    },
    {
      id: 'phone',
      title: 'Direct Phone',
      desc: 'Direct mobile line for urgent consultations & calls',
      value: `${PERSONAL_INFO.phone} (${PERSONAL_INFO.phoneLocal})`,
      badge: 'Voice Call',
      href: `tel:${PERSONAL_INFO.phone.replace(/\s+/g, '')}`,
      icon: <Phone className="w-6 h-6 text-[#d0bcff]" />,
      buttonText: 'Call Direct',
      accentColor: 'border-[#d0bcff]/40 hover:border-[#d0bcff] group-hover:shadow-[0_0_30px_rgba(208,188,255,0.25)]',
      copyable: true,
      copied: copiedPhone,
      onCopy: handleCopyPhone
    }
  ];

  return (
    <section id="contact" className="w-full flex flex-col gap-8 pt-8">
      {/* Section Header */}
      <div className="flex flex-col gap-1.5 border-b border-white/[0.06] pb-6">
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            [ DIRECT CONNECT ]
          </span>
          <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
        </div>
        <h2 className="text-3xl sm:text-4xl font-bold text-[#e1e2ec] font-display tracking-tight">
          Get in Touch
        </h2>
        <p className="text-sm sm:text-base text-[#b9cacb] max-w-2xl leading-relaxed">
          Ready to kick off a new project, consult on architecture, or discuss freelance collaborations? Reach out directly across any preferred channel below.
        </p>
      </div>

      {/* Grid of Direct Contact & Social Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {contactChannels.map((channel) => (
          <div
            key={channel.id}
            className={`group p-6 rounded-2xl bg-[#272a32] border transition-all duration-300 flex flex-col justify-between gap-5 backdrop-blur-xl ${channel.accentColor} hover:-translate-y-1`}
          >
            <div className="flex flex-col gap-4">
              {/* Top Row: Icon & Badge */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-xl bg-[#191b23] border border-white/[0.08] flex items-center justify-center group-hover:scale-110 transition-transform">
                  {channel.icon}
                </div>
                <span className="font-mono text-[11px] px-2.5 py-1 rounded-full bg-[#191b23] border border-white/[0.08] text-[#b9cacb]">
                  {channel.badge}
                </span>
              </div>

              {/* Title & Description */}
              <div className="flex flex-col gap-1">
                <h3 className="text-xl font-bold text-[#e1e2ec] font-display">
                  {channel.title}
                </h3>
                <p className="text-xs text-[#b9cacb] leading-relaxed">
                  {channel.desc}
                </p>
              </div>

              {/* Display Value with Optional Copy Button */}
              <div className="p-3 rounded-lg bg-[#0b0e15] border border-white/[0.06] flex items-center justify-between gap-2">
                <span className="font-mono text-xs text-[#00f0ff] truncate font-medium">
                  {channel.value}
                </span>
                {channel.copyable && (
                  <button
                    onClick={channel.onCopy}
                    className="p-1 rounded text-[#849495] hover:text-[#00f0ff] transition-colors shrink-0 cursor-pointer"
                    title="Copy to clipboard"
                    aria-label="Copy to clipboard"
                  >
                    {channel.copied ? (
                      <Check className="w-3.5 h-3.5 text-[#00f0ff]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                )}
              </div>
            </div>

            {/* Direct Action Button */}
            <a
              href={channel.href}
              target={channel.href.startsWith('http') ? '_blank' : undefined}
              rel={channel.href.startsWith('http') ? 'noopener noreferrer' : undefined}
              className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-[#191b23] border border-white/[0.08] text-[#e1e2ec] font-semibold text-xs font-mono group-hover:bg-[#00f0ff] group-hover:text-[#002022] group-hover:border-transparent transition-all duration-200 shadow cursor-pointer"
            >
              <span>{channel.buttonText}</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        ))}
      </div>

      {/* Live Availability Banner */}
      <div className="p-5 rounded-2xl bg-[#191b23] border border-white/[0.08] flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 rounded-full bg-[#00f0ff] animate-ping" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold text-[#e1e2ec] font-display">
              Ready for New Projects &amp; Collaborations
            </span>
            <span className="font-mono text-xs text-[#b9cacb]">
              Ultra-fast turnarounds, clean code architecture &amp; modern UI delivery.
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <button
            onClick={() => setIsInquiryOpen(true)}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#272a32] border border-[#00f0ff]/30 text-[#00f0ff] font-semibold text-xs font-mono hover:bg-[#00f0ff] hover:text-[#002022] transition-all cursor-pointer shadow-md"
          >
            <Database className="w-3.5 h-3.5" />
            <span>Drop Direct Note (Supabase)</span>
          </button>

          <a
            href={PERSONAL_INFO.whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#00f0ff] text-[#002022] font-semibold text-xs font-mono hover:bg-[#dbfcff] transition-all shadow-[0_0_20px_rgba(0,240,255,0.3)] shrink-0 cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Quick WhatsApp Dispatch</span>
          </a>
        </div>
      </div>

      {/* Supabase Quick Inquiry Modal */}
      {isInquiryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-lg rounded-2xl bg-[#191b23] border border-[#00f0ff]/30 p-6 sm:p-8 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col gap-5">
            {/* Modal Header */}
            <div className="flex items-center justify-between border-b border-white/[0.08] pb-4">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-[#00f0ff]/10 flex items-center justify-center text-[#00f0ff]">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-[#e1e2ec] font-display">
                    Direct Inquiry (Supabase)
                  </h3>
                  <p className="text-xs text-[#849495] font-mono">
                    Saves directly to Abdul Rehman's backend database
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsInquiryOpen(false)}
                className="p-1.5 rounded-lg text-[#849495] hover:text-[#e1e2ec] hover:bg-white/[0.06] transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Success Feedback */}
            {sentSuccess ? (
              <div className="py-8 flex flex-col items-center justify-center gap-3 text-center">
                <div className="w-14 h-14 rounded-full bg-[#00f0ff]/15 flex items-center justify-center text-[#00f0ff]">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h4 className="text-lg font-bold text-[#e1e2ec] font-display">
                  Message Transmitted!
                </h4>
                <p className="text-xs text-[#b9cacb] max-w-xs font-mono">
                  Your inquiry has been stored in Abdul Rehman's Supabase database. He will get back to you shortly!
                </p>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleInquirySubmit} className="flex flex-col gap-4">
                {sendError && (
                  <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs">
                    {sendError}
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-[#b9cacb]">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={inquiryForm.name}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, name: e.target.value })}
                      placeholder="e.g. Elena Rostova"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>

                  <div className="flex flex-col gap-1">
                    <label className="font-mono text-xs text-[#b9cacb]">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={inquiryForm.email}
                      onChange={(e) => setInquiryForm({ ...inquiryForm, email: e.target.value })}
                      placeholder="elena@example.com"
                      className="w-full px-3.5 py-2 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#b9cacb]">Phone / WhatsApp (Optional)</label>
                  <input
                    type="text"
                    value={inquiryForm.phone}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, phone: e.target.value })}
                    placeholder="+92 300 1234567"
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff]"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="font-mono text-xs text-[#b9cacb]">Project Details / Message *</label>
                  <textarea
                    rows={3}
                    required
                    value={inquiryForm.message}
                    onChange={(e) => setInquiryForm({ ...inquiryForm, message: e.target.value })}
                    placeholder="Tell Abdul Rehman about your project requirements..."
                    className="w-full px-3.5 py-2 rounded-lg bg-[#0b0e15] border border-white/[0.08] text-sm text-[#e1e2ec] focus:outline-none focus:border-[#00f0ff] resize-none"
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-2 border-t border-white/[0.08]">
                  <button
                    type="button"
                    onClick={() => setIsInquiryOpen(false)}
                    className="px-4 py-2 rounded-lg text-xs font-mono text-[#b9cacb] hover:text-white transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSending}
                    className="inline-flex items-center gap-2 px-6 py-2 rounded-lg bg-[#00f0ff] text-[#002022] font-semibold font-mono text-xs hover:bg-[#dbfcff] transition-all disabled:opacity-50 cursor-pointer shadow-[0_0_20px_rgba(0,240,255,0.3)]"
                  >
                    {isSending ? (
                      <>
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                        <span>Saving to Supabase...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </section>
  );
};
