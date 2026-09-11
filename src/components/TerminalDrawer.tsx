import React, { useState, useRef, useEffect } from 'react';
import { Terminal, X, Minimize2, Maximize2, Sparkles, Send } from 'lucide-react';
import { PERSONAL_INFO, SKILLS, PROJECTS, CERTIFICATE } from '../data/portfolioData';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface CommandHistoryItem {
  command: string;
  output: React.ReactNode;
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({ isOpen, onClose }) => {
  const [inputCommand, setInputCommand] = useState('');
  const [history, setHistory] = useState<CommandHistoryItem[]>([
    {
      command: 'welcome',
      output: (
        <div className="flex flex-col gap-1 text-[#b9cacb]">
          <p className="text-[#00f0ff] font-bold">
            ⚡ Abdul Rehman OS v2.4 (Lahore Subsystem) initialized.
          </p>
          <p className="text-xs">
            Type <span className="text-[#d0bcff] font-semibold">help</span> to view available terminal directives or <span className="text-[#d0bcff] font-semibold">hire</span> to dispatch directly.
          </p>
        </div>
      )
    }
  ]);
  const bottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (isOpen) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [history, isOpen]);

  if (!isOpen) return null;

  const handleRunCommand = (e: React.FormEvent) => {
    e.preventDefault();
    const cmd = inputCommand.trim().toLowerCase();
    if (!cmd) return;

    let outputNode: React.ReactNode;

    switch (cmd) {
      case 'help':
        outputNode = (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs text-[#b9cacb]">
            <div><span className="text-[#00f0ff] font-bold">about</span> - Abdul's profile &amp; background</div>
            <div><span className="text-[#00f0ff] font-bold">skills</span> - Production tech stack &amp; percentages</div>
            <div><span className="text-[#00f0ff] font-bold">projects</span> - Deployed system artifacts</div>
            <div><span className="text-[#00f0ff] font-bold">certificate</span> - Verified Nexskill 2026 credential</div>
            <div><span className="text-[#00f0ff] font-bold">contact</span> - Direct phone, email &amp; socials</div>
            <div><span className="text-[#00f0ff] font-bold">hire</span> - Instant WhatsApp dispatch link</div>
            <div><span className="text-[#00f0ff] font-bold">neofetch</span> - System telemetry diagnostics</div>
            <div><span className="text-[#00f0ff] font-bold">clear</span> - Flush terminal screen</div>
          </div>
        );
        break;

      case 'about':
      case 'bio':
        outputNode = (
          <div className="flex flex-col gap-1 text-xs text-[#b9cacb]">
            <p className="text-[#e1e2ec] font-bold">{PERSONAL_INFO.name} — {PERSONAL_INFO.tagline}</p>
            <p>Location: {PERSONAL_INFO.location}</p>
            <p>Status: {PERSONAL_INFO.status}</p>
            <p className="text-[#849495] mt-1">{PERSONAL_INFO.bio}</p>
          </div>
        );
        break;

      case 'skills':
        outputNode = (
          <div className="flex flex-col gap-1 text-xs">
            {SKILLS.map((s, i) => (
              <div key={i} className="flex justify-between items-center text-[#b9cacb]">
                <span className="text-[#e1e2ec]">{s.name}</span>
                <span className={s.color === 'cyan' ? 'text-[#00f0ff]' : 'text-[#d0bcff]'}>
                  [Verified • {s.category.toUpperCase()}]
                </span>
              </div>
            ))}
          </div>
        );

        break;

      case 'projects':
        outputNode = (
          <div className="flex flex-col gap-2 text-xs">
            {PROJECTS.map((p, i) => (
              <div key={i} className="border-l-2 border-[#00f0ff] pl-2 text-[#b9cacb]">
                <p className="font-bold text-[#e1e2ec]">{p.title} ({p.type})</p>
                <p className="text-[#849495]">{p.tags.join(' • ')}</p>
              </div>
            ))}
          </div>
        );
        break;

      case 'certificate':
        outputNode = (
          <div className="text-xs text-[#b9cacb] flex flex-col gap-1">
            <p className="text-[#00f0ff] font-bold">{CERTIFICATE.title}</p>
            <p>Issued by: {CERTIFICATE.organization} ({CERTIFICATE.year})</p>
            <p>Credential ID: {CERTIFICATE.credentialId} (Verified High Honors)</p>
          </div>
        );
        break;

      case 'contact':
        outputNode = (
          <div className="text-xs text-[#b9cacb] flex flex-col gap-1">
            <p>WhatsApp / Mobile: <span className="text-[#00f0ff]">{PERSONAL_INFO.phone}</span> ({PERSONAL_INFO.phoneLocal})</p>
            <p>Email: <span className="text-[#d0bcff]">{PERSONAL_INFO.email}</span></p>
            <p>Telemetry Coords: {PERSONAL_INFO.coordinates}</p>
          </div>
        );
        break;

      case 'hire':
        outputNode = (
          <div className="text-xs text-[#00f0ff] flex flex-col gap-1">
            <p className="font-bold">Opening WhatsApp direct communication bridge...</p>
            <a
              href={PERSONAL_INFO.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="underline text-white hover:text-[#00f0ff]"
            >
              Click here to chat with Abdul on WhatsApp (+92 309 1875679)
            </a>
          </div>
        );
        break;

      case 'neofetch':
        outputNode = (
          <div className="font-mono text-[11px] text-[#b9cacb] leading-tight flex flex-col gap-1">
            <p className="text-[#00f0ff]">        /\_/\        OS: Abdul Rehman Portfolio Core</p>
            <p className="text-[#00f0ff]">       ( o.o )       Host: React 19 / Vite / Tailwind v4</p>
            <p className="text-[#00f0ff]">        &gt; ^ &lt;        Kernel: WebGL 2.0 / Three.js r125</p>
            <p className="text-[#d0bcff]">                     Uptime: 99.98% / Freelance Active</p>
            <p className="text-[#d0bcff]">                     Location: Babu Sabu, Lahore (PKT UTC+5)</p>
            <p className="text-[#d0bcff]">                     Phone: +92 309 1875679</p>
            <div className="flex gap-1 mt-1">
              <span className="w-3 h-3 bg-[#ffb4ab] inline-block rounded-sm" />
              <span className="w-3 h-3 bg-[#e9ddff] inline-block rounded-sm" />
              <span className="w-3 h-3 bg-[#00f0ff] inline-block rounded-sm" />
              <span className="w-3 h-3 bg-[#571bc1] inline-block rounded-sm" />
              <span className="w-3 h-3 bg-[#006970] inline-block rounded-sm" />
            </div>
          </div>
        );
        break;

      case 'clear':
        setHistory([]);
        setInputCommand('');
        return;

      default:
        outputNode = (
          <p className="text-xs text-[#ffb4ab]">
            Command not recognized: "{cmd}". Type <span className="text-[#00f0ff]">help</span> for directive index.
          </p>
        );
    }

    setHistory((prev) => [...prev, { command: inputCommand, output: outputNode }]);
    setInputCommand('');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="w-full max-w-2xl rounded-2xl bg-[#0b0e15] border border-[#00f0ff]/40 shadow-[0_0_50px_rgba(0,240,255,0.25)] flex flex-col font-mono text-sm overflow-hidden max-h-[85vh]">
        {/* Terminal Titlebar with macOS / Cyber style micro-dots */}
        <div className="px-4 py-3 bg-[#191b23] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-[#ffb4ab] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#e9ddff] inline-block" />
            <span className="w-3 h-3 rounded-full bg-[#00f0ff] inline-block" />
            <span className="text-xs font-semibold text-[#e1e2ec] ml-2 flex items-center gap-1.5">
              <Terminal className="w-3.5 h-3.5 text-[#00f0ff]" />
              <span>abdul@rehman-console: ~</span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setHistory([])}
              className="text-[11px] text-[#849495] hover:text-[#00f0ff] transition-colors px-2 py-0.5 rounded bg-[#272a32]"
            >
              Clear
            </button>
            <button
              onClick={onClose}
              className="p-1 rounded text-[#b9cacb] hover:text-[#ffb4ab] transition-colors"
              aria-label="Close terminal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Terminal Screen Stream */}
        <div className="p-4 sm:p-5 flex-1 overflow-y-auto flex flex-col gap-3 min-h-[260px] max-h-[460px] bg-[#0b0e15]">
          {history.map((item, index) => (
            <div key={index} className="flex flex-col gap-1">
              <div className="flex items-center gap-2 text-xs">
                <span className="text-[#00f0ff] font-bold">$</span>
                <span className="text-[#d0bcff]">{item.command}</span>
              </div>
              <div className="pl-4 py-1">{item.output}</div>
            </div>
          ))}
          <div ref={bottomRef} />
        </div>

        {/* Input Bar */}
        <form
          onSubmit={handleRunCommand}
          className="p-3 bg-[#191b23] border-t border-white/[0.08] flex items-center gap-2"
        >
          <span className="text-[#00f0ff] font-bold text-xs">$</span>
          <input
            type="text"
            value={inputCommand}
            onChange={(e) => setInputCommand(e.target.value)}
            placeholder="Type directive (e.g. help, skills, hire, neofetch)..."
            autoFocus
            className="flex-1 bg-transparent text-[#e1e2ec] text-xs focus:outline-none placeholder:text-[#849495]"
          />
          <button
            type="submit"
            className="p-1.5 rounded bg-[#00f0ff] text-[#002022] hover:bg-[#dbfcff] transition-all"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
