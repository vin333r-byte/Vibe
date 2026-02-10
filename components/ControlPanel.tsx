import React, { useState } from 'react';
import { SimulationConfig, PresetName, ColorPalette } from '../types';
import { PALETTES, PRESETS } from '../constants';
import { Settings2, X, Share2, Info } from 'lucide-react';

interface ControlPanelProps {
  config: SimulationConfig;
  setConfig: React.Dispatch<React.SetStateAction<SimulationConfig>>;
}

const ControlPanel: React.FC<ControlPanelProps> = ({ config, setConfig }) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState<'presets' | 'advanced'>('presets');

  const handlePresetChange = (name: PresetName) => {
    setConfig(prev => ({
      ...prev,
      ...PRESETS[name]
    }));
  };

  const handleValueChange = (key: keyof SimulationConfig, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };
  
  const handlePaletteChange = (palette: ColorPalette) => {
    setConfig(prev => ({ ...prev, palette }));
  };

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="absolute top-4 right-4 z-10 p-3 bg-black/40 backdrop-blur-md border border-white/10 rounded-full text-white hover:bg-white/10 transition-all shadow-lg"
      >
        <Settings2 size={24} />
      </button>
    );
  }

  return (
    <div className="absolute top-4 right-4 z-10 w-80 md:w-96 max-h-[90vh] flex flex-col bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl text-white overflow-hidden transition-all duration-300">
      
      {/* Header */}
      <div className="flex items-center justify-between p-5 border-b border-white/10 bg-white/5">
        <h2 className="text-xl font-bold tracking-tight bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">Flux Engine</h2>
        <div className="flex gap-2">
           <button onClick={() => setIsOpen(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
            <X size={20} className="text-gray-400" />
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 m-4 bg-black/40 rounded-lg border border-white/5">
        <button
          onClick={() => setActiveTab('presets')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === 'presets' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Presets
        </button>
        <button
          onClick={() => setActiveTab('advanced')}
          className={`flex-1 py-1.5 text-sm font-medium rounded-md transition-all ${
            activeTab === 'advanced' ? 'bg-white/20 text-white shadow-sm' : 'text-gray-400 hover:text-white'
          }`}
        >
          Customize
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-5 pt-0 space-y-6 custom-scrollbar">
        
        {activeTab === 'presets' && (
          <div className="grid grid-cols-2 gap-3">
            {(Object.keys(PRESETS) as PresetName[]).map((name) => (
              <button
                key={name}
                onClick={() => handlePresetChange(name)}
                className={`p-4 rounded-xl border text-left transition-all group relative overflow-hidden ${
                  config.palette.name === name 
                    ? 'border-cyan-500/50 bg-cyan-500/10' 
                    : 'border-white/10 bg-white/5 hover:border-white/30 hover:bg-white/10'
                }`}
              >
                <div className="relative z-10">
                  <div className="font-semibold text-sm mb-1">{name}</div>
                  <div className="flex gap-1 h-2 mt-2 opacity-80">
                    {PALETTES[name].colors.slice(0, 3).map((c, i) => (
                      <div key={i} className="w-4 h-4 rounded-full" style={{ backgroundColor: c }} />
                    ))}
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}

        {activeTab === 'advanced' && (
          <div className="space-y-6">
            
            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Physics</label>
              
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Speed</span>
                  <span className="text-cyan-400">{config.baseSpeed.toFixed(1)}</span>
                </div>
                <input
                  type="range"
                  min="0.5"
                  max="10"
                  step="0.1"
                  value={config.baseSpeed}
                  onChange={(e) => handleValueChange('baseSpeed', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Count</span>
                  <span className="text-cyan-400">{config.particleCount}</span>
                </div>
                <input
                  type="range"
                  min="500"
                  max="5000"
                  step="100"
                  value={config.particleCount}
                  onChange={(e) => handleValueChange('particleCount', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                />
              </div>

              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Flow Noise</span>
                  <span className="text-cyan-400">{(config.flowScale * 1000).toFixed(0)}</span>
                </div>
                <input
                  type="range"
                  min="0.001"
                  max="0.02"
                  step="0.001"
                  value={config.flowScale}
                  onChange={(e) => handleValueChange('flowScale', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-500 hover:accent-cyan-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Visuals</label>
               <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Trail Fade</span>
                  <span className="text-purple-400">{config.fadeRate.toFixed(2)}</span>
                </div>
                <input
                  type="range"
                  min="0.01"
                  max="0.5"
                  step="0.01"
                  value={config.fadeRate}
                  onChange={(e) => handleValueChange('fadeRate', parseFloat(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-purple-500 hover:accent-purple-400"
                />
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">Interaction</label>
               <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-300">Force</span>
                  <span className="text-pink-400">{config.interactionStrength}</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="50"
                  step="1"
                  value={config.interactionStrength}
                  onChange={(e) => handleValueChange('interactionStrength', parseInt(e.target.value))}
                  className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-pink-500 hover:accent-pink-400"
                />
              </div>
            </div>

          </div>
        )}
      </div>
      
      {/* Footer Info */}
      <div className="p-4 border-t border-white/10 bg-white/5 text-xs text-gray-500 flex justify-center text-center">
         <p>Move mouse or touch to disrupt the field.</p>
      </div>

    </div>
  );
};

export default ControlPanel;