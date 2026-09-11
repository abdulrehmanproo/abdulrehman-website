import React, { useState } from 'react';
import {
  ExternalLink,
  Code2,
  MemoryStick as Memory,
  Bike,
  Box,
  CloudLightning,
  Layers,
  ArrowUpRight
} from 'lucide-react';
import { PROJECTS } from '../data/portfolioData';
import { Project } from '../types';
import { ProjectDemoModal } from './ProjectDemoModal';

export const ProjectsSection: React.FC = () => {
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [modalMode, setModalMode] = useState<'demo' | 'repo'>('demo');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleOpenModal = (project: Project, mode: 'demo' | 'repo') => {
    setSelectedProject(project);
    setModalMode(mode);
    setModalOpen(true);
  };

  const getProjectIcon = (iconName: string, isCyan: boolean) => {
    const className = `w-5 h-5 transition-colors ${
      isCyan ? 'text-[#00f0ff]' : 'text-[#d0bcff]'
    }`;

    switch (iconName) {
      case 'memory':
        return <Memory className={className} />;
      case 'delivery_dining':
        return <Bike className={className} />;
      case 'view_in_ar':
        return <Box className={className} />;
      case 'thunderstorm':
      default:
        return <CloudLightning className={className} />;
    }
  };

  return (
    <section id="projects" className="w-full flex flex-col gap-8 pt-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/[0.06] pb-6">
        <div className="flex flex-col gap-1.5">
          <span className="font-mono text-xs text-[#00f0ff] uppercase tracking-widest font-semibold">
            [ DEPLOYED ARTIFACTS ]
          </span>
          <h2 className="text-3xl sm:text-4xl font-bold text-[#e1e2ec] font-display tracking-tight">
            Featured Projects
          </h2>
        </div>
        <span className="font-mono text-xs sm:text-sm text-[#b9cacb]">
          Engineered for dynamic scale, velocity, and intuitive feedback
        </span>
      </div>

      {/* Bento Project Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">
        {PROJECTS.map((project) => {
          const isCyan = project.accentColor === 'cyan';
          return (
            <div
              key={project.id}
              className={`group rounded-2xl bg-[#272a32] border border-white/[0.08] shadow-lg transition-all duration-300 p-6 sm:p-7 flex flex-col justify-between gap-5 hover:-translate-y-1 ${
                isCyan
                  ? 'hover:border-[#00f0ff]/40 hover:shadow-[0_0_30px_rgba(0,240,255,0.2)]'
                  : 'hover:border-[#d0bcff]/40 hover:shadow-[0_0_30px_rgba(208,188,255,0.2)]'
              }`}
            >
              <div className="flex flex-col gap-3">
                {/* Category & Icon */}
                <div className="flex items-center justify-between">
                  <span
                    className={`font-mono text-xs font-semibold tracking-wider ${
                      isCyan ? 'text-[#00f0ff]' : 'text-[#d0bcff]'
                    }`}
                  >
                    {project.category}
                  </span>
                  <div className="p-2 rounded-lg bg-[#191b23] border border-white/[0.06]">
                    {getProjectIcon(project.icon, isCyan)}
                  </div>
                </div>

                {/* Title */}
                <h3
                  className={`text-xl sm:text-2xl font-bold text-[#e1e2ec] font-display transition-colors ${
                    isCyan ? 'group-hover:text-[#00f0ff]' : 'group-hover:text-[#d0bcff]'
                  }`}
                >
                  {project.title}
                </h3>

                {/* Description */}
                <p className="text-sm text-[#b9cacb] leading-relaxed">
                  {project.description}
                </p>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5 pt-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-2.5 py-1 bg-[#0b0e15] border border-white/[0.06] rounded-md font-mono text-xs text-[#b9cacb]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-3 pt-3 border-t border-white/[0.06]">
                <button
                  onClick={() => handleOpenModal(project, 'demo')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#00f0ff] text-[#002022] font-semibold text-xs sm:text-sm hover:bg-[#dbfcff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.25)] cursor-pointer"
                >
                  <span>Live Demo</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </button>

                <button
                  onClick={() => handleOpenModal(project, 'repo')}
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-[#191b23] border border-white/[0.08] text-[#e1e2ec] hover:text-[#00f0ff] hover:border-[#00f0ff]/30 transition-all font-mono text-xs sm:text-sm cursor-pointer"
                >
                  <Code2 className="w-3.5 h-3.5" />
                  <span>Repository</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Interactive Modal */}
      <ProjectDemoModal
        project={selectedProject}
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        mode={modalMode}
      />
    </section>
  );
};
