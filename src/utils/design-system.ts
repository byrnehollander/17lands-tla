import { CardSize, CardSizes } from '../types';

// Constants
export const MIN_COUNT = 100;

// Design system
export const SPACING = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 15,
  xl: 20,
  xxl: 25,
  xxxl: 30
} as const;

export const COLORS = {
  background: {
    primary: '#1a1a1a',
    secondary: '#2a2a2a',
    border: '#444'
  },
  text: {
    primary: '#fff',
    secondary: '#bbb',
    muted: '#888',
    accent: '#aaa'
  },
  archetype: {
    highlight: '#2d4aa7',
    pin: '#ff6b6b',
    pinHover: '#e55555'
  }
} as const;

export const CARD_SIZES: Record<CardSize, CardSizes> = {
  large: { 
    imageWidth: 396, 
    containerWidth: 386, 
    marginLeft: 30, 
    fontSize: 18, 
    marginBottom: 70 
  },
  medium: { 
    imageWidth: 320, 
    containerWidth: 310, 
    marginLeft: 20, 
    fontSize: 17, 
    marginBottom: 50 
  },
  small: { 
    imageWidth: 288, 
    containerWidth: 278, 
    marginLeft: 10, 
    fontSize: 16, 
    marginBottom: 40 
  },
  compact: { 
    imageWidth: 240, 
    containerWidth: 230, 
    marginLeft: 8, 
    fontSize: 15, 
    marginBottom: 30 
  }
};

export function getCardSizeForCount(count: number): CardSize {
  if (count <= 2) return 'large';
  if (count <= 4) return 'medium';
  if (count <= 8) return 'small';
  return 'compact';
}

export function getGridColumnsForCount(count: number): number {
  if (count <= 2) return 2;
  if (count <= 4) return 3;
  if (count <= 8) return 4;
  return 5;
}

export function getMinWidthForColumns(columns: number): string {
  if (columns <= 2) return '380px';
  if (columns === 3) return '320px';
  if (columns === 4) return '280px';
  return '250px';
}