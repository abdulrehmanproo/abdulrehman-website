import React, { useState, useEffect } from 'react';
import {
  ArrowRight,
  Mail,
  CheckCircle2,
  Sparkles,
  Play
} from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TikTokIcon, GithubIcon, LinkedInIcon } from './SocialIcons';

interface HeroSectionProps {}

// Roles that cycle every 3 seconds
const ROLES = [
  'Full Stack Developer',
  'UI/UX Designer',
  'React & Next.js Expert',
  'ICS Student',
  'Freelancer & Collaborator',
];

export const HeroSection: React.FC<HeroSectionProps> = () => {
  const [roleIndex, setRoleIndex] = useState(0);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => {
      // Fade out
      setVisible(false);
      setTimeout(() => {
        setRoleIndex((prev) => (prev + 1) % ROLES.length);
        // Fade back in
        setVisible(true);
      }, 400);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section
      id="about"
      className="w-full flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-14 pt-4 md:pt-10 pb-8"
    >
      {/* ── Left Column: Hero Text, Pitch, Actions, Socials ── */}
      <div className="flex-1 flex flex-col items-start gap-6 max-w-2xl">

        {/* Status Pill Badge — slides in from left */}
        <div className="hero-item-1 inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#191b23]/90 border border-[#00f0ff]/40 shadow-[0_0_20px_rgba(0,240,255,0.2)] backdrop-blur-md hover:border-[#00f0ff] transition-all duration-300 hover:scale-105 cursor-default">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00f0ff] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#00f0ff]"></span>
          </span>
          <span className="font-mono text-xs text-[#00f0ff] tracking-wider uppercase font-semibold flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 animate-pulse" />
            <span>Available for Freelance &amp; Collaborations</span>
          </span>
        </div>

        {/* Headings */}
        <div className="hero-item-2 flex flex-col gap-3">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-[#e1e2ec] font-display">
            Hi, I'm{' '}
            <span className="relative inline-block animate-shimmer drop-shadow-[0_0_30px_rgba(0,240,255,0.45)]">
              Abdul Rehman
            </span>
          </h1>

          {/* Cycling role text — changes every 3s */}
          <div className="flex items-center gap-3 h-10">
            <span className="w-1 h-8 bg-gradient-to-b from-[#00f0ff] to-[#a855f7] rounded-full shrink-0" />
            <p
              className="text-xl sm:text-2xl font-semibold font-display transition-all duration-400"
              style={{
                opacity: visible ? 1 : 0,
                transform: visible ? 'translateY(0px)' : 'translateY(8px)',
                transition: 'opacity 0.4s ease, transform 0.4s ease',
                background: 'linear-gradient(90deg, #d0bcff, #00f0ff)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              {ROLES[roleIndex]}
            </p>
          </div>
        </div>

        {/* Narrative bio glass card */}
        <div className="hero-item-3 relative p-5 sm:p-6 rounded-2xl bg-[#191b23]/70 border border-white/[0.08] hover:border-[#00f0ff]/35 backdrop-blur-md transition-all duration-500 group shadow-xl hover:shadow-[0_10px_30px_rgba(0,240,255,0.08)]">
          <div className="absolute left-0 top-3 bottom-3 w-1 bg-gradient-to-b from-[#00f0ff] to-[#d0bcff] rounded-r-full opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
          <p className="text-base sm:text-lg text-[#b9cacb] leading-relaxed pl-2 group-hover:text-[#e1e2ec] transition-colors duration-500">
            {PERSONAL_INFO.bio}
          </p>
        </div>

        {/* CTA Action Buttons */}
        <div className="hero-item-4 flex flex-wrap items-center gap-3 pt-1 w-full">
          <a
            href="#contact"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 rounded-xl bg-gradient-to-r from-[#00f0ff] to-[#00c8d6] text-[#002022] font-bold text-base shadow-[0_0_30px_rgba(0,240,255,0.45)] hover:shadow-[0_0_50px_rgba(0,240,255,0.7)] hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer group"
          >
            <Mail className="w-4 h-4 group-hover:rotate-12 transition-transform duration-300" />
            <span>Contact Me</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform duration-300" />
          </a>
          <a
            href="#showcase"
            className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-[#272a32] text-[#e1e2ec] hover:text-[#00f0ff] hover:bg-[#32353d] border border-white/[0.08] hover:border-[#00f0ff]/40 font-semibold text-base transition-all duration-300 cursor-pointer hover:scale-105 active:scale-95 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)] group"
          >
            <Play className="w-4 h-4 text-[#00f0ff] group-hover:scale-125 transition-transform duration-300" />
            <span>Watch Media &amp; Showcase</span>
          </a>
        </div>

        {/* Social Network Triggers */}
        <div className="hero-item-5 flex items-center gap-4 pt-2">
          <span className="font-mono text-xs text-[#849495] tracking-wider uppercase">
            CONNECT:
          </span>
          <div className="flex items-center gap-2.5">
            {/* GitHub */}
            <a
              href={PERSONAL_INFO.github}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub Profile"
              title="GitHub Profile"
              className="w-10 h-10 rounded-xl bg-[#272a32] border border-white/[0.08] flex items-center justify-center text-[#e1e2ec] hover:bg-[#00f0ff] hover:text-[#002022] hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-[0_0_18px_rgba(0,240,255,0.5)] shadow-md"
            >
              <GithubIcon className="w-5 h-5" />
            </a>

            {/* LinkedIn */}
            <a
              href={PERSONAL_INFO.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn Profile"
              title="LinkedIn Profile"
              className="w-10 h-10 rounded-xl bg-[#272a32] border border-white/[0.08] flex items-center justify-center text-[#e1e2ec] hover:bg-[#0077b5] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-[0_0_18px_rgba(0,119,181,0.5)] shadow-md"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>

            {/* TikTok */}
            <a
              href={PERSONAL_INFO.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="TikTok Profile"
              title="TikTok Profile (@abdulrehman38762)"
              className="w-10 h-10 rounded-xl bg-[#272a32] border border-white/[0.08] flex items-center justify-center text-[#e1e2ec] hover:bg-[#ff0050] hover:text-white hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-[0_0_18px_rgba(255,0,80,0.5)] shadow-md"
            >
              <TikTokIcon className="w-5 h-5" />
            </a>

            {/* Email */}
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              aria-label="Send Email"
              title={`Email: ${PERSONAL_INFO.email}`}
              className="w-10 h-10 rounded-xl bg-[#272a32] border border-white/[0.08] flex items-center justify-center text-[#e1e2ec] hover:bg-[#00f0ff] hover:text-[#002022] hover:border-transparent transition-all duration-200 hover:scale-110 hover:shadow-[0_0_18px_rgba(0,240,255,0.5)] shadow-md"
            >
              <Mail className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {/* ── Right Column: Profile Picture with Cinematic Multi-Layer Animation ── */}
      <div className="relative flex items-center justify-center shrink-0 w-full lg:w-auto animate-scale-in">

        {/* Ambient morphing back-glow blob */}
        <div className="absolute -inset-12 rounded-full bg-gradient-to-r from-[#00f0ff]/20 via-[#a855f7]/15 to-[#00f0ff]/20 blur-3xl animate-glow-morph pointer-events-none" />
        <div className="absolute -inset-16 rounded-full bg-gradient-to-br from-[#a855f7]/10 via-transparent to-[#00f0ff]/10 blur-3xl animate-glow-morph pointer-events-none" style={{ animationDelay: '4s' }} />

        {/* Outer slow-spin gradient ring */}
        <div
          className="absolute -inset-3 rounded-full opacity-30 blur-md animate-spin-slow pointer-events-none"
          style={{ background: 'conic-gradient(from 0deg, #00f0ff, #a855f7, #00c8d6, #d0bcff, #00f0ff)' }}
        />

        {/* Inner reverse-spin ring */}
        <div
          className="absolute -inset-1.5 rounded-full opacity-50 animate-spin-slow-reverse pointer-events-none"
          style={{ background: 'conic-gradient(from 180deg, #a855f7, #00f0ff, transparent, #00f0ff, #a855f7)' }}
        />

        {/* Neon pulsing border ring */}
        <div className="absolute -inset-0.5 rounded-full animate-neon-pulse-ring pointer-events-none border-2 border-[#00f0ff]/40" />

        {/* Orbiting glowing dot 1 */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-3 h-3 rounded-full bg-[#00f0ff] shadow-[0_0_12px_4px_rgba(0,240,255,0.8)] animate-orbit"
            style={{ animationDuration: '9s' }}
          />
        </div>

        {/* Orbiting glowing dot 2 (reverse, smaller, violet) */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div
            className="absolute w-2 h-2 rounded-full bg-[#a855f7] shadow-[0_0_10px_3px_rgba(168,85,247,0.8)] animate-orbit-reverse"
            style={{ animationDuration: '14s' }}
          />
        </div>

        {/* Main profile image container */}
        <div className="relative w-80 h-80 sm:w-96 sm:h-96 lg:w-[420px] lg:h-[420px] rounded-full p-2 bg-gradient-to-b from-[#191b23] to-[#0b0e15] border-2 border-[#00f0ff]/45 shadow-[0_0_50px_rgba(0,240,255,0.3)] shrink-0 group transition-all duration-700 hover:border-[#00f0ff] hover:shadow-[0_0_80px_rgba(0,240,255,0.5)] hover:scale-[1.03] animate-float-gentle">
          <div className="w-full h-full rounded-full overflow-hidden relative bg-[#0b0e15] border border-white/[0.1]">
            <img
              src={PERSONAL_INFO.avatarUrl}
              alt="Abdul Rehman - Full Stack Web Developer and ICS Student"
              className="w-full h-full object-cover object-[50%_6%] scale-105 transition-transform duration-700 ease-out group-hover:scale-110"
            />

            {/* Subtle radial gradient overlay for depth */}
            <div className="absolute inset-0 bg-gradient-to-t from-[#0b0e15]/80 via-transparent to-transparent pointer-events-none" />

            {/* Hover shine sweep effect */}
            <div
              className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
              style={{
                background: 'linear-gradient(135deg, rgba(0,240,255,0.08) 0%, transparent 50%, rgba(168,85,247,0.08) 100%)'
              }}
            />

            {/* Status & Name overlay badge */}
            <div className="absolute inset-0 flex items-end justify-center pb-6 pointer-events-none">
              <div className="bg-[#0b0e15]/90 border border-[#00f0ff]/40 backdrop-blur-md px-5 py-2 rounded-full flex items-center gap-2 shadow-[0_0_20px_rgba(0,240,255,0.25)] group-hover:border-[#00f0ff] group-hover:shadow-[0_0_30px_rgba(0,240,255,0.4)] transition-all duration-500">
                <CheckCircle2 className="w-4 h-4 text-[#00f0ff] animate-pulse" />
                <span className="font-mono text-xs text-[#e1e2ec] font-semibold tracking-wide">
                  {PERSONAL_INFO.name}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
