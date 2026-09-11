import React, { useState } from 'react';
import {
  GraduationCap,
  Globe,
  Zap,
  ShieldCheck,
  Code2,
  FileCode,
  Layers,
  Terminal,
  GitBranch,
  Palette,
  CheckCircle,
  Cpu
} from 'lucide-react';
import { HIGHLIGHTS, SKILLS, PERSONAL_INFO } from '../data/portfolioData';

export const AboutSection: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeSkillHover, setActiveSkillHover] = useState<string | null>(null);

  const getHighlightIcon = (iconName: string) => {
    switch (iconName) {
      case 'school':
        return <GraduationCap className="w-8 h-8 text-[#00f0ff]" />;
      case 'public':
        return <Globe className="w-8 h-8 text-[#d0bcff]" />;
      case 'bolt':
        return <Zap className="w-8 h-8 text-[#00f0ff]" />;
      case 'verified_user':
      default:
        return <ShieldCheck className="w-8 h-8 text-[#d0bcff]" />;
    }
  };

  const getSkillIcon = (iconName: string) => {
    switch (iconName) {
      case 'html':
        return <FileCode className="w-6 h-6 text-[#00f0ff]" />;
      case 'javascript':
        return <Code2 className="w-6 h-6 text-[#d0bcff]" />;
      case 'deployed_code':
        return <Layers className="w-6 h-6 text-[#00f0ff]" />;
      case 'terminal':
        return <Terminal className="w-6 h-6 text-[#d0bcff]" />;
      case 'fork_right':
        return <GitBranch className="w-6 h-6 text-[#00f0ff]" />;
      case 'palette':
      default:
        return <Palette className="w-6 h-6 text-[#d0bcff]" />;
    }
  };

  const filteredSkills = selectedCategory === 'all'
    ? SKILLS
    : SKILLS.filter(s => s.category === selectedCategory);

  return (
    <section id="skills" className="w-full flex flex-col gap-12 pt-8">
      {/* Header & Diagnostic */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            [ SYSTEM DIAGNOSTIC ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e1e2ec] font-display tracking-tight">
            About Me &amp; Background
          </h2>
        </div>
        <p className="font-mono text-xs sm:text-sm text-[#b9cacb] max-w-md leading-relaxed">
          {PERSONAL_INFO.diagnostic}
        </p>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {HIGHLIGHTS.map((item) => {
          const isCyan = item.accent === 'cyan';
          return (
            <div
              key={item.id}
              className={`p-6 rounded-2xl bg-[#272a32] border border-white/[0.08] shadow-md flex flex-col gap-3 transition-all duration-300 hover:bg-[#363941] hover:-translate-y-1 ${
                isCyan
                  ? 'hover:border-[#00f0ff]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.15)]'
                  : 'hover:border-[#d0bcff]/50 hover:shadow-[0_0_20px_rgba(208,188,255,0.15)]'
              }`}
            >
              <div className="p-2 w-fit rounded-xl bg-[#191b23] border border-white/[0.06]">
                {getHighlightIcon(item.icon)}
              </div>
              <span className="text-lg font-semibold text-[#e1e2ec] font-display">
                {item.title}
              </span>
              <p className="text-sm text-[#b9cacb] leading-relaxed">
                {item.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* Core Technical Stack & Mastery Header */}
      <div className="flex flex-col gap-6 mt-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 className="text-2xl sm:text-3xl font-bold text-[#e1e2ec] font-display">
              Core Technical Stack &amp; Mastery
            </h3>
            <p className="text-sm text-[#849495] mt-1">
              Engineered with production rigor, modern tooling, and optimal performance benchmarks.
            </p>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-1.5 p-1 bg-[#191b23] rounded-xl border border-white/[0.08] overflow-x-auto">
            {[
              { label: 'All', id: 'all' },
              { label: 'Frontend', id: 'frontend' },
              { label: 'Languages', id: 'languages' },
              { label: 'Tools', id: 'tools' }
            ].map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 py-1 rounded-lg text-xs font-mono transition-all duration-200 whitespace-nowrap ${
                  selectedCategory === cat.id
                    ? 'bg-[#00f0ff] text-[#002022] font-semibold shadow-[0_0_12px_rgba(0,240,255,0.3)]'
                    : 'text-[#b9cacb] hover:text-[#e1e2ec] hover:bg-[#272a32]'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Skills Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSkills.map((skill) => {
            const isCyan = skill.color === 'cyan';
            return (
              <div
                key={skill.name}
                onMouseEnter={() => setActiveSkillHover(skill.name)}
                onMouseLeave={() => setActiveSkillHover(null)}
                className={`p-6 rounded-2xl bg-[#191b23] border border-white/[0.08] shadow-md flex flex-col gap-3 group transition-all duration-300 hover:bg-[#272a32] ${
                  isCyan
                    ? 'hover:border-[#00f0ff]/50 hover:shadow-[0_0_25px_rgba(0,240,255,0.2)]'
                    : 'hover:border-[#d0bcff]/50 hover:shadow-[0_0_25px_rgba(208,188,255,0.2)]'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-[#0b0e15] border border-white/[0.06]">
                      {getSkillIcon(skill.icon)}
                    </div>
                    <span className="text-base font-semibold text-[#e1e2ec] font-display">
                      {skill.name}
                    </span>
                  </div>
                  <span
                    className={`font-mono text-xs uppercase font-semibold px-2.5 py-1 rounded-full ${
                      isCyan
                        ? 'text-[#00f0ff] bg-[#00f0ff]/10 border border-[#00f0ff]/30'
                        : 'text-[#d0bcff] bg-[#d0bcff]/10 border border-[#d0bcff]/30'
                    }`}
                  >
                    {skill.category}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-[#b9cacb] leading-relaxed">
                  {skill.description}
                </p>

                <div className="pt-1 flex items-center justify-between border-t border-white/[0.04]">
                  <span className="font-mono text-[11px] text-[#849495] uppercase">
                    Status: Verified Production
                  </span>
                  <span className="flex items-center gap-1 text-[11px] font-mono text-[#00f0ff]">
                    <CheckCircle className="w-3 h-3" />
                    <span>Active Mastery</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
