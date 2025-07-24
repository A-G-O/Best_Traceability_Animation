import { SupplyChainNode } from '../types';

export const supplyChainNodes: SupplyChainNode[] = [
  {
    id: 'cotton-farm',
    name: 'Cotton Farm',
    location: 'Gujarat, India',
    coordinates: [23.0225, 72.5714],
    tier: 0,
    icon: '🌱',
    color: '#34D399',
    className: 'cotton-farm'
  },
  {
    id: 'textile-mill',
    name: 'Textile Mill',
    location: 'Dhaka, Bangladesh',
    coordinates: [23.8103, 90.4125],
    tier: 1,
    icon: '🏭',
    color: '#FBBF24',
    className: 'textile-mill'
  },
  {
    id: 'garment-factory',
    name: 'Garment Factory',
    location: 'Ho Chi Minh City, Vietnam',
    coordinates: [10.8231, 106.6297],
    tier: 2,
    icon: '👕',
    color: '#F472B6',
    className: 'garment-factory'
  },
  {
    id: 'distribution-hub',
    name: 'Distribution Hub',
    location: 'Shanghai, China',
    coordinates: [31.2304, 121.4737],
    tier: 3,
    icon: '📦',
    color: '#60A5FA',
    className: 'distribution-hub'
  },
  {
    id: 'retail-store',
    name: 'Retail Store',
    location: 'New York, USA',
    coordinates: [40.7128, -74.0060],
    tier: 4,
    icon: '🏪',
    color: '#A78BFA',
    className: 'retail-store'
  }
];