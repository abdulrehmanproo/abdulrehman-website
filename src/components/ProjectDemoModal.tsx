import React, { useState } from 'react';
import {
  X,
  ExternalLink,
  Code2,
  CheckCircle2,
  ShoppingCart,
  MapPin,
  Smartphone,
  CloudRain,
  Sliders,
  Play,
  RotateCcw,
  Sparkles,
  Zap
} from 'lucide-react';
import { Project } from '../types';

interface ProjectDemoModalProps {
  project: Project | null;
  isOpen: boolean;
  onClose: () => void;
  mode: 'demo' | 'repo';
}

export const ProjectDemoModal: React.FC<ProjectDemoModalProps> = ({
  project,
  isOpen,
  onClose,
  mode
}) => {
  if (!isOpen || !project) return null;

  // State for simulated interactivity in demos
  const [techTitanCartCount, setTechTitanCartCount] = useState(2);
  const [techTitanConfig, setTechTitanConfig] = useState<'budget' | 'pro' | 'extreme'>('pro');

  const [courierStatus, setCourierStatus] = useState<string>('En Route to Delivery Address');
  const [courierEta, setCourierEta] = useState<number>(14);

  const [phoneColor, setPhoneColor] = useState<'cyan' | 'violet' | 'obsidian' | 'titanium'>('cyan');
  const [explodedView, setExplodedView] = useState(false);

  const [weatherCity, setWeatherCity] = useState('Lahore, PK');
  const [radarActive, setRadarActive] = useState(true);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl rounded-3xl bg-[#191b23] border border-[#00f0ff]/40 shadow-[0_0_60px_rgba(0,240,255,0.25)] flex flex-col text-[#e1e2ec] max-h-[92vh] overflow-hidden">
        {/* Header */}
        <div className="p-5 sm:p-6 bg-[#0b0e15] border-b border-white/[0.08] flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={`p-2.5 rounded-xl ${
                project.accentColor === 'cyan'
                  ? 'bg-[#00f0ff]/10 text-[#00f0ff] border border-[#00f0ff]/30'
                  : 'bg-[#d0bcff]/10 text-[#d0bcff] border border-[#d0bcff]/30'
              }`}
            >
              {mode === 'demo' ? <Play className="w-5 h-5" /> : <Code2 className="w-5 h-5" />}
            </div>
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-[#849495]">
                {mode === 'demo' ? 'INTERACTIVE LIVE SANDBOX' : 'SOURCE CODE REPOSITORY TELEMETRY'}
              </span>
              <h3 className="text-xl font-bold font-display text-[#e1e2ec]">
                {project.title}
              </h3>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-full bg-[#272a32] text-[#b9cacb] hover:text-[#00f0ff] hover:bg-[#32353d] transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto flex-1 flex flex-col gap-6">
          {mode === 'demo' ? (
            /* Interactive Sandbox View */
            <div className="flex flex-col gap-6">
              {/* TechTitan Interactive Sandbox */}
              {project.id === 'techtitan' && (
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0b0e15] border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <ShoppingCart className="w-5 h-5 text-[#00f0ff]" />
                      <span className="font-display font-bold text-base">Custom Rig Configurator</span>
                    </div>
                    <div className="flex items-center gap-2 font-mono text-xs text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full border border-[#00f0ff]/30">
                      <span>Live Cart: {techTitanCartCount} Items</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {[
                      { id: 'budget', name: 'RTX 4070 Dual', cpu: 'Ryzen 7 7800X3D', price: '$1,899', wattage: '650W' },
                      { id: 'pro', name: 'RTX 4080 Super', cpu: 'Core i9-14900K', price: '$2,799', wattage: '850W' },
                      { id: 'extreme', name: 'RTX 4090 OC 24GB', cpu: 'Ryzen 9 7950X3D', price: '$4,299', wattage: '1000W' },
                    ].map((tier) => (
                      <button
                        key={tier.id}
                        onClick={() => setTechTitanConfig(tier.id as any)}
                        className={`p-4 rounded-xl text-left border transition-all ${
                          techTitanConfig === tier.id
                            ? 'bg-[#272a32] border-[#00f0ff] shadow-[0_0_15px_rgba(0,240,255,0.25)]'
                            : 'bg-[#191b23] border-white/[0.06] hover:border-white/[0.2]'
                        }`}
                      >
                        <div className="flex justify-between items-center mb-1">
                          <span className="font-bold text-sm text-[#e1e2ec]">{tier.name}</span>
                          <span className="font-mono text-xs text-[#00f0ff] font-semibold">{tier.price}</span>
                        </div>
                        <p className="text-xs text-[#b9cacb]">{tier.cpu}</p>
                        <div className="mt-2 text-[11px] font-mono text-[#849495] flex items-center justify-between">
                          <span>Est. Draw: {tier.wattage}</span>
                          <span className="text-[#00f0ff]">In Stock</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <div className="p-4 rounded-xl bg-[#191b23] flex flex-col sm:flex-row items-center justify-between gap-3 border border-white/[0.06]">
                    <div className="flex items-center gap-2">
                      <Zap className="w-4 h-4 text-[#00f0ff]" />
                      <span className="text-xs font-mono text-[#b9cacb]">
                        Stripe 3D-Secure Test Pipeline: Active &amp; Ready
                      </span>
                    </div>
                    <button
                      onClick={() => setTechTitanCartCount(techTitanCartCount + 1)}
                      className="w-full sm:w-auto px-4 py-2 rounded-lg bg-[#00f0ff] text-[#002022] font-semibold text-xs hover:bg-[#dbfcff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
                    >
                      + Add Config to Test Cart
                    </button>
                  </div>
                </div>
              )}

              {/* CraveDash Interactive Sandbox */}
              {project.id === 'cravedash' && (
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0b0e15] border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-5 h-5 text-[#d0bcff]" />
                      <span className="font-display font-bold text-base">Live Courier GPS Dispatch</span>
                    </div>
                    <span className="font-mono text-xs text-[#d0bcff] bg-[#d0bcff]/10 px-2.5 py-1 rounded-full border border-[#d0bcff]/30">
                      WebSocket Ping: 14ms
                    </span>
                  </div>

                  <div className="relative h-44 rounded-xl bg-[#191b23] border border-white/[0.08] overflow-hidden flex flex-col items-center justify-center p-4">
                    {/* Simulated map route visualization */}
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#d0bcff_1px,transparent_1px)] [background-size:16px_16px]" />
                    <div className="relative z-10 flex flex-col items-center gap-2 text-center">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-[#571bc1] border border-[#d0bcff] flex items-center justify-center text-white">
                          🏍️
                        </div>
                        <div className="h-0.5 w-24 sm:w-40 bg-gradient-to-r from-[#d0bcff] to-[#00f0ff] relative">
                          <div className="absolute -top-1 right-0 w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                        </div>
                        <div className="w-10 h-10 rounded-full bg-[#272a32] border border-[#00f0ff] flex items-center justify-center text-[#00f0ff]">
                          🏠
                        </div>
                      </div>
                      <span className="font-mono text-sm font-semibold text-[#e1e2ec] mt-2">
                        {courierStatus}
                      </span>
                      <span className="font-mono text-xs text-[#d0bcff]">
                        Estimated Arrival: {courierEta} minutes
                      </span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setCourierEta(Math.max(2, courierEta - 2));
                        setCourierStatus('Courier approaching your landmark');
                      }}
                      className="flex-1 py-2 rounded-lg bg-[#272a32] hover:bg-[#32353d] text-xs font-mono text-[#d0bcff] transition-colors border border-white/[0.06]"
                    >
                      Simulate Rider Move
                    </button>
                    <button
                      onClick={() => {
                        setCourierEta(14);
                        setCourierStatus('Dispatched from Restaurant Kitchen');
                      }}
                      className="px-4 py-2 rounded-lg bg-[#191b23] text-xs font-mono text-[#849495] hover:text-[#e1e2ec] transition-colors"
                    >
                      Reset
                    </button>
                  </div>
                </div>
              )}

              {/* LuxeMobile Interactive Sandbox */}
              {project.id === 'luxemobile' && (
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0b0e15] border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <Smartphone className="w-5 h-5 text-[#00f0ff]" />
                      <span className="font-display font-bold text-base">3D Shader &amp; Colorway Lab</span>
                    </div>
                    <span className="font-mono text-xs text-[#00f0ff] bg-[#00f0ff]/10 px-2.5 py-1 rounded-full border border-[#00f0ff]/30">
                      WebGL 2.0 PBR Shading
                    </span>
                  </div>

                  <div className="h-44 rounded-xl bg-[#191b23] border border-white/[0.08] flex items-center justify-center relative overflow-hidden">
                    <div
                      className={`w-28 h-40 rounded-2xl border-4 transition-all duration-500 flex flex-col items-center justify-between p-2 shadow-2xl ${
                        phoneColor === 'cyan'
                          ? 'border-[#00f0ff] bg-[#002022] shadow-[0_0_30px_rgba(0,240,255,0.4)]'
                          : phoneColor === 'violet'
                          ? 'border-[#d0bcff] bg-[#23005c] shadow-[0_0_30px_rgba(208,188,255,0.4)]'
                          : phoneColor === 'titanium'
                          ? 'border-[#94a3b8] bg-[#1e293b] shadow-[0_0_20px_rgba(255,255,255,0.2)]'
                          : 'border-[#334155] bg-[#090d16] shadow-[0_0_20px_rgba(0,0,0,0.8)]'
                      } ${explodedView ? 'scale-110 rotate-12' : 'scale-100 rotate-0'}`}
                    >
                      <div className="w-8 h-1.5 rounded-full bg-black/60" />
                      <div className="text-center font-mono text-[10px] text-white/80">
                        {explodedView ? 'EXPLODED VIEW' : 'LUXE X-PRO'}
                      </div>
                      <div className="w-4 h-4 rounded-full border border-white/40 flex items-center justify-center">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#00f0ff]" />
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs text-[#849495]">Titanium Finishes:</span>
                      {(['cyan', 'violet', 'titanium', 'obsidian'] as const).map((color) => (
                        <button
                          key={color}
                          onClick={() => setPhoneColor(color)}
                          className={`w-6 h-6 rounded-full border-2 transition-transform ${
                            phoneColor === color ? 'scale-125 border-white' : 'border-transparent'
                          } ${
                            color === 'cyan'
                              ? 'bg-[#00f0ff]'
                              : color === 'violet'
                              ? 'bg-[#d0bcff]'
                              : color === 'titanium'
                              ? 'bg-[#94a3b8]'
                              : 'bg-[#1e293b]'
                          }`}
                        />
                      ))}
                    </div>

                    <button
                      onClick={() => setExplodedView(!explodedView)}
                      className="px-3 py-1.5 rounded-lg bg-[#272a32] text-xs font-mono text-[#00f0ff] hover:bg-[#32353d] transition-colors border border-white/[0.08]"
                    >
                      {explodedView ? 'Normal Chassis View' : 'Toggle Exploded Internals'}
                    </button>
                  </div>
                </div>
              )}

              {/* CyberWeather Interactive Sandbox */}
              {project.id === 'cyberweather' && (
                <div className="flex flex-col gap-4 p-5 rounded-2xl bg-[#0b0e15] border border-white/[0.08]">
                  <div className="flex items-center justify-between border-b border-white/[0.08] pb-3">
                    <div className="flex items-center gap-2">
                      <CloudRain className="w-5 h-5 text-[#d0bcff]" />
                      <span className="font-display font-bold text-base">Atmospheric Telemetry &amp; Radar</span>
                    </div>
                    <span className="font-mono text-xs text-[#d0bcff] bg-[#d0bcff]/10 px-2.5 py-1 rounded-full border border-[#d0bcff]/30">
                      OpenWeather V3.0
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                    <div className="p-3 rounded-xl bg-[#191b23] border border-white/[0.06]">
                      <span className="text-[10px] text-[#849495] block">CITY STATION</span>
                      <span className="text-sm text-[#e1e2ec] font-bold">{weatherCity}</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b23] border border-white/[0.06]">
                      <span className="text-[10px] text-[#849495] block">TEMP / AMBIENT</span>
                      <span className="text-sm text-[#00f0ff] font-bold">28°C / Clear</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b23] border border-white/[0.06]">
                      <span className="text-[10px] text-[#849495] block">HUMIDITY INDEX</span>
                      <span className="text-sm text-[#d0bcff] font-bold">42% RH</span>
                    </div>
                    <div className="p-3 rounded-xl bg-[#191b23] border border-white/[0.06]">
                      <span className="text-[10px] text-[#849495] block">BAROMETER</span>
                      <span className="text-sm text-[#e1e2ec] font-bold">1014 hPa</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div className="flex items-center gap-2 text-xs text-[#b9cacb]">
                      <span className="w-2 h-2 rounded-full bg-[#00f0ff] animate-ping" />
                      <span>Live Radar Stream Updating Every 30s</span>
                    </div>
                    <button
                      onClick={() => setWeatherCity(weatherCity === 'Lahore, PK' ? 'Karachi, PK' : 'Lahore, PK')}
                      className="px-3 py-1.5 rounded-lg bg-[#272a32] text-xs font-mono text-[#d0bcff] hover:bg-[#32353d] transition-colors"
                    >
                      Switch Station
                    </button>
                  </div>
                </div>
              )}

              {/* Core Feature Checklist */}
              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs uppercase text-[#849495]">
                  Engineered Feature Architecture:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 text-xs text-[#b9cacb]">
                      <CheckCircle2 className="w-4 h-4 text-[#00f0ff] shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            /* Source Code Repository Overview */
            <div className="flex flex-col gap-5">
              <div className="p-4 rounded-xl bg-[#0b0e15] border border-white/[0.08] font-mono text-xs leading-relaxed text-[#b9cacb]">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-white/[0.06]">
                  <span className="text-[#00f0ff]">git remote -v</span>
                  <span className="text-[#849495]">origin (fetch &amp; push)</span>
                </div>
                <p className="text-[#e1e2ec]">
                  repository: <span className="text-[#d0bcff]">github.com/abdulrehman-dev/{project.id}</span>
                </p>
                <p className="text-[#849495] mt-1">branch: main (verified build passing)</p>
              </div>

              {/* Architecture specs */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {project.metrics?.map((m, i) => (
                  <div key={i} className="p-3 rounded-xl bg-[#272a32] border border-white/[0.06]">
                    <span className="font-mono text-[11px] text-[#849495] uppercase block">{m.label}</span>
                    <span className="text-lg font-bold text-[#00f0ff] font-display">{m.value}</span>
                  </div>
                ))}
              </div>

              <div className="flex flex-col gap-2">
                <span className="font-mono text-xs text-[#849495] uppercase">
                  Production Dependencies &amp; Integrations:
                </span>
                <div className="flex flex-wrap gap-2">
                  {project.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg bg-[#272a32] border border-white/[0.08] text-xs font-mono text-[#e1e2ec]"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 sm:p-5 bg-[#0b0e15] border-t border-white/[0.08] flex flex-wrap items-center justify-between gap-3">
          <span className="font-mono text-xs text-[#849495]">
            Project Status: Fully Deployed &amp; Active
          </span>
          <div className="flex items-center gap-3">
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-lg bg-[#272a32] text-xs font-medium text-[#e1e2ec] hover:bg-[#32353d]"
            >
              Close
            </button>
            <a
              href="https://wa.me/923091875679?text=Hi%20Abdul%2C%20I%20saw%20your%20project%20showcase%20and%20would%20like%20to%20collaborate."
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-lg bg-[#00f0ff] text-[#002022] text-xs font-semibold hover:bg-[#dbfcff] transition-all shadow-[0_0_15px_rgba(0,240,255,0.3)]"
            >
              Discuss This Build on WhatsApp
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
