export interface ColorPalette {
  name: string;
  colors: string[]; // Hex codes
}

export interface SimulationConfig {
  particleCount: number;
  baseSpeed: number;
  flowScale: number; // Zoom level of noise
  trailOpacity: number; // 0 to 1
  interactionRadius: number;
  interactionStrength: number;
  palette: ColorPalette;
  noiseDetail: number; // Complexity of the flow
  fadeRate: number; // How fast trails disappear
}

export type PresetName = 'Nebula' | 'Cyberpunk' | 'Aurora' | 'Inferno' | 'Monochrome';