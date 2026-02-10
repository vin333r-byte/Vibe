import { ColorPalette, PresetName, SimulationConfig } from './types';

export const PALETTES: Record<PresetName, ColorPalette> = {
  Nebula: {
    name: 'Nebula',
    colors: ['#4f46e5', '#ec4899', '#8b5cf6', '#06b6d4', '#ffffff'],
  },
  Cyberpunk: {
    name: 'Cyberpunk',
    colors: ['#facc15', '#f472b6', '#22d3ee', '#000000', '#10b981'],
  },
  Aurora: {
    name: 'Aurora',
    colors: ['#059669', '#34d399', '#a7f3d0', '#6366f1', '#1e1b4b'],
  },
  Inferno: {
    name: 'Inferno',
    colors: ['#ef4444', '#f97316', '#fbbf24', '#7f1d1d', '#fff7ed'],
  },
  Monochrome: {
    name: 'Monochrome',
    colors: ['#ffffff', '#e5e5e5', '#a3a3a3', '#525252', '#171717'],
  },
};

export const DEFAULT_CONFIG: SimulationConfig = {
  particleCount: 3000,
  baseSpeed: 2,
  flowScale: 0.005,
  trailOpacity: 0.05,
  interactionRadius: 150,
  interactionStrength: 5,
  palette: PALETTES.Nebula,
  noiseDetail: 1,
  fadeRate: 0.08,
};

export const PRESETS: Record<PresetName, Partial<SimulationConfig>> = {
  Nebula: { ...DEFAULT_CONFIG, palette: PALETTES.Nebula, flowScale: 0.005, baseSpeed: 2 },
  Cyberpunk: { 
    palette: PALETTES.Cyberpunk, 
    baseSpeed: 4, 
    flowScale: 0.01, 
    interactionStrength: 10,
    fadeRate: 0.15 
  },
  Aurora: { 
    palette: PALETTES.Aurora, 
    baseSpeed: 1, 
    flowScale: 0.002, 
    particleCount: 4000,
    fadeRate: 0.04
  },
  Inferno: { 
    palette: PALETTES.Inferno, 
    baseSpeed: 6, 
    flowScale: 0.008, 
    interactionStrength: 20, 
    trailOpacity: 0.1 
  },
  Monochrome: { 
    palette: PALETTES.Monochrome, 
    baseSpeed: 3, 
    flowScale: 0.005, 
    particleCount: 2000,
    trailOpacity: 0.02
  },
};