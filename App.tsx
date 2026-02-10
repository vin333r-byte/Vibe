import React, { useState } from 'react';
import SimulationCanvas from './components/SimulationCanvas';
import ControlPanel from './components/ControlPanel';
import { DEFAULT_CONFIG } from './constants';
import { SimulationConfig } from './types';

function App() {
  const [config, setConfig] = useState<SimulationConfig>(DEFAULT_CONFIG);

  return (
    <div className="relative w-screen h-screen bg-black overflow-hidden font-sans">
      {/* Background Canvas */}
      <div className="absolute inset-0 z-0">
        <SimulationCanvas config={config} />
      </div>

      {/* Foreground UI */}
      <ControlPanel config={config} setConfig={setConfig} />

      {/* Branding / Title Overlay (optional, subtle) */}
      <div className="absolute bottom-6 left-6 z-0 pointer-events-none opacity-50 select-none">
        <h1 className="text-5xl font-black text-white/5 tracking-tighter">FLUX</h1>
      </div>
      
      {/* Hint for interaction */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-0 animate-fade-in-delayed">
        <span className="text-white/20 text-lg font-light tracking-widest">TOUCH & FLOW</span>
      </div>
    </div>
  );
}

export default App;