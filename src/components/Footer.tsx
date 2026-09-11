import React from 'react';
import { Mail, ArrowUp } from 'lucide-react';
import { PERSONAL_INFO } from '../data/portfolioData';
import { TikTokIcon, GithubIcon, LinkedInIcon } from './SocialIcons';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="w-full bg-[#0b0e15] border-t border-white/[0.06] mt-16">
      <div className="max-w-[1200px] mx-auto px-4 md:px-8 py-12 sm:py-16 flex flex-col gap-10">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-8">
          {/* Brand Info */}
          <div className="flex flex-col gap-2 max-w-md">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm font-bold text-[#00f0ff] bg-[#272a32] px-2 py-1 rounded-lg border border-[#00f0ff]/20">
                [AR]
              </span>
              <span className="text-xl font-bold text-[#e1e2ec] font-display">
                {PERSONAL_INFO.name}
              </span>
            </div>
            <p className="text-sm text-[#b9cacb] leading-relaxed">
              Full Stack Web Developer &amp; ICS Student. Engineering scalable modern applications and responsive digital experiences.
            </p>
          </div>

          {/* Quick links & Social triggers */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-6">
            <a
              href={`mailto:${PERSONAL_INFO.email}`}
              className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-[#272a32] border border-white/[0.08] text-[#e1e2ec] hover:bg-[#32353d] hover:text-[#00f0ff] transition-all text-sm font-mono"
            >
              <Mail className="w-4 h-4 text-[#00f0ff]" />
              <span>{PERSONAL_INFO.email}</span>
            </a>

            <div className="flex items-center gap-2.5">
              <a
                href={PERSONAL_INFO.github}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub Repository"
                title="GitHub Profile"
                className="w-10 h-10 rounded-lg bg-[#191b23] border border-white/[0.06] flex items-center justify-center text-[#b9cacb] hover:bg-[#00f0ff] hover:text-[#002022] transition-all"
              >
                <GithubIcon className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn Profile"
                title="LinkedIn Profile"
                className="w-10 h-10 rounded-lg bg-[#191b23] border border-white/[0.06] flex items-center justify-center text-[#b9cacb] hover:bg-[#0077b5] hover:text-white transition-all"
              >
                <LinkedInIcon className="w-4 h-4" />
              </a>
              <a
                href={PERSONAL_INFO.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok Profile"
                title="TikTok Profile (@abdulrehman38762)"
                className="w-10 h-10 rounded-lg bg-[#191b23] border border-white/[0.06] flex items-center justify-center text-[#b9cacb] hover:bg-[#ff0050] hover:text-white transition-all"
              >
                <TikTokIcon className="w-4 h-4" />
              </a>


              <button
                onClick={scrollToTop}
                aria-label="Scroll to top"
                className="w-10 h-10 rounded-lg bg-[#191b23] border border-white/[0.06] flex items-center justify-center text-[#b9cacb] hover:bg-[#00f0ff] hover:text-[#002022] transition-all ml-2"
                title="Back to Top"
              >
                <ArrowUp className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Bar with System Telemetry */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 bg-[#191b23]/40 rounded-xl px-5 py-3 border border-white/[0.04]">
          <p className="font-mono text-xs text-[#849495] text-center sm:text-left">
            © 2025 Abdul Rehman. All technical telemetry reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="font-mono text-xs text-[#849495] uppercase tracking-wider">
              SYS-LATENCY: 12ms
            </span>
            <div className="flex items-center gap-1.5 font-mono text-xs text-[#00f0ff] uppercase tracking-wider font-semibold">
              <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-pulse" />
              <span>PROD ACTIVE</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
