import {
  calculateDiffFromAverageWinRate,
  calculateDiffFromAverageBGWinRate,
  calculateDiffFromAverageBRWinRate,
  calculateDiffFromAverageRGWinRate,
  calculateDiffFromAverageUBWinRate,
  calculateDiffFromAverageUGWinRate,
  calculateDiffFromAverageURWinRate,
  calculateDiffFromAverageWBWinRate,
  calculateDiffFromAverageWGWinRate,
  calculateDiffFromAverageWRWinRate,
  calculateDiffFromAverageWUWinRate
} from '../helpers';
import { ArchetypeName } from '../types';

export const ARCHETYPE_FUNCTION_MAP = {
  'Overall': calculateDiffFromAverageWinRate,
  'BG': calculateDiffFromAverageBGWinRate,
  'BR': calculateDiffFromAverageBRWinRate,
  'RG': calculateDiffFromAverageRGWinRate,
  'UB': calculateDiffFromAverageUBWinRate,
  'UG': calculateDiffFromAverageUGWinRate,
  'UR': calculateDiffFromAverageURWinRate,
  'WB': calculateDiffFromAverageWBWinRate,
  'WG': calculateDiffFromAverageWGWinRate,
  'WR': calculateDiffFromAverageWRWinRate,
  'WU': calculateDiffFromAverageWUWinRate
} as const;

export function getArchetypeFunction(archetype: ArchetypeName) {
  return ARCHETYPE_FUNCTION_MAP[archetype] || calculateDiffFromAverageWinRate;
}

export const ARCHETYPE_DISPLAY_NAMES = {
  'Overall': 'Overall',
  'WU': 'Azorius (WU)',
  'UB': 'Dimir (UB)',
  'BR': 'Rakdos (BR)',
  'RG': 'Gruul (RG)',
  'WG': 'Selesnya (WG)',
  'WB': 'Orzhov (WB)',
  'UR': 'Izzet (UR)',
  'BG': 'Golgari (BG)',
  'WR': 'Boros (WR)',
  'UG': 'Simic (UG)'
} as const;