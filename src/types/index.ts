export interface SupplyChainNode {
  id: string;
  name: string;
  location: string;
  coordinates: [number, number];
  tier: number;
  icon: string;
  color: string;
  className: string;
}

export interface AnimationState {
  currentStage: number;
  isAnimating: boolean;
  isPaused: boolean;
  speed: number;
  stageStartTime: number;
  stageDuration: number;
}

export type AnimationSpeed = 0.5 | 1 | 2;

export interface TierInfo {
  tier: number;
  name: string;
  location: string;
  region: string;
}