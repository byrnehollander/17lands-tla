// Core data types
export interface ArchetypeStats {
  gihWR: number | null;
  gihWRCount: number;
  avgPick: number;
  avgSeen: number;
}

export interface CardData {
  name: string;
  colors: string[];
  keywords: string[];
  cmc: number;
  rarity: string;
  image: string;
  backImage: string | null;
  type: string;
  gihWRByColors: {
    Overall?: ArchetypeStats;
    BG?: ArchetypeStats;
    BR?: ArchetypeStats;
    RG?: ArchetypeStats;
    UB?: ArchetypeStats;
    UG?: ArchetypeStats;
    UR?: ArchetypeStats;
    WB?: ArchetypeStats;
    WG?: ArchetypeStats;
    WR?: ArchetypeStats;
    WU?: ArchetypeStats;
  };
}

// Component prop types
export interface CardDisplayProps {
  cards: CardData[];
  renderBothSides: boolean;
  pinnedCards: Set<string>;
  togglePinCard: (cardName: string) => void;
  selectedArchetype: ArchetypeName;
}

export interface CompareViewProps {
  pinnedCards: Set<string>;
  selectedArchetype: ArchetypeName;
  renderBothSides: boolean;
}

// Archetype types
export type ArchetypeName = 
  | 'Overall'
  | 'BG'
  | 'BR'
  | 'RG'
  | 'UB'
  | 'UG'
  | 'UR'
  | 'WB'
  | 'WG'
  | 'WR'
  | 'WU';

export type CardSize = 'large' | 'medium' | 'small' | 'compact';

export interface CardSizes {
  imageWidth: number;
  containerWidth: number;
  marginLeft: number;
  fontSize: number;
  marginBottom: number;
}