import React from 'react';
import styled from 'styled-components';
import { TypographyShadow } from './sharedStyles';
import cards from './ratingsPairs.json';
import { getArchetypeFunction } from './utils/archetypes';
import { MIN_COUNT, SPACING, COLORS } from './utils/design-system';
import { CardData, CompareViewProps, ArchetypeName, ArchetypeStats } from './types';

interface ContainerProps {
  cardCount: number;
}

const CompareContainer = styled.div<ContainerProps>`
  display: grid;
  grid-template-columns: ${({ cardCount }) => {
    if (cardCount <= 2) return `repeat(${cardCount}, minmax(350px, 400px))`;
    if (cardCount === 3) return 'repeat(auto-fit, minmax(320px, 1fr))';
    if (cardCount <= 4) return 'repeat(auto-fit, minmax(280px, 1fr))';
    return 'repeat(auto-fit, minmax(250px, 1fr))';
  }};
  gap: ${({ cardCount }) => cardCount > 3 ? SPACING.lg : SPACING.xxl}px;
  margin-top: ${SPACING.xxxl}px;
  justify-content: center;
`;

const CardCompareItem = styled.div<ContainerProps>`
  border: 2px solid ${COLORS.background.border};
  border-radius: 8px;
  padding: ${({ cardCount }) => cardCount > 3 ? SPACING.md : SPACING.xl}px;
  background-color: ${COLORS.background.primary};
`;

const CardImage = styled.img<ContainerProps>`
  width: 100%;
  max-width: ${({ cardCount }) => 
    cardCount > 4 ? '220px' : cardCount > 3 ? '240px' : '300px'
  };
  border-radius: 8px;
  margin-bottom: ${({ cardCount }) => cardCount > 3 ? SPACING.sm : SPACING.lg}px;
`;

const MetricsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const MetricRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
  border-bottom: 1px solid #333;
`;

const ArchetypeHighlight = styled.div`
  background-color: ${COLORS.archetype.highlight};
  padding: 3px 8px;
  border-radius: 4px;
  font-weight: bold;
`;

const CompareView: React.FC<CompareViewProps> = ({ 
  pinnedCards, 
  selectedArchetype, 
  renderBothSides 
}) => {
  const pinnedCardData = (cards as CardData[]).filter(card => pinnedCards.has(card.name));


  const renderMetrics = (card: CardData) => {
    const gihWRByColors = card.gihWRByColors || {};
    
    // Get all available color pairs sorted by win rate
    const colorPairs = (Object.keys(gihWRByColors) as ArchetypeName[])
      .filter(key => {
        const stats = gihWRByColors[key];
        return stats && stats.gihWRCount > MIN_COUNT;
      })
      .map(key => [key, gihWRByColors[key]!] as [ArchetypeName, ArchetypeStats])
      .sort((a, b) => parseFloat(b[1].gihWR?.toString() || '0') - parseFloat(a[1].gihWR?.toString() || '0'));

    return colorPairs.map(([colorPairName, stats]) => {
      const func = getArchetypeFunction(colorPairName);
      const isSelectedArchetype = colorPairName === selectedArchetype;
      
      return (
        <MetricRow key={colorPairName}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            {isSelectedArchetype ? (
              <ArchetypeHighlight>{colorPairName}:</ArchetypeHighlight>
            ) : (
              <span>{colorPairName}:</span>
            )}
          </div>
          <div>
            <strong>{stats.gihWR ? (stats.gihWR * 100).toFixed(1) : '0.0'}%</strong>
            <span style={{ marginLeft: 8, color: '#aaa' }}>
              [{func(stats.gihWR ? stats.gihWR * 100 : 0)}] ({stats.gihWRCount})
            </span>
          </div>
        </MetricRow>
      );
    });
  };

  const renderCardStats = (card: CardData) => {
    const overallStats = card.gihWRByColors?.Overall;
    if (!overallStats) return null;

    return (
      <div style={{ 
        marginBottom: 15, 
        padding: '12px', 
        backgroundColor: '#2a2a2a', 
        borderRadius: '6px',
        fontSize: pinnedCardData.length > 4 ? '14px' : '15px'
      }}>
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-around', 
          marginBottom: 12,
          fontSize: pinnedCardData.length > 4 ? '13px' : '14px',
          fontWeight: 'bold'
        }}>
          <div><strong>ALSA:</strong> {overallStats.avgSeen.toFixed(2)}</div>
          <div><strong>ATA:</strong> {overallStats.avgPick.toFixed(2)}</div>
        </div>
        <MetricsContainer>
          {renderMetrics(card)}
        </MetricsContainer>
      </div>
    );
  };

  if (pinnedCardData.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '40px' }}>
        <TypographyShadow variant="h5">
          No cards pinned for comparison
        </TypographyShadow>
        <p style={{ color: '#aaa', marginTop: 10 }}>
          Search for cards and click the pin icon to add them to comparison
        </p>
      </div>
    );
  }

  return (
    <div>
      <TypographyShadow variant="h4" gutterBottom style={{ textAlign: 'center' }}>
        Quick Compare ({pinnedCardData.length} cards)
      </TypographyShadow>
      {selectedArchetype !== 'Overall' && (
        <div style={{ textAlign: 'center', marginBottom: 20, color: '#aaa' }}>
          Focusing on <strong>{selectedArchetype}</strong> archetype data
        </div>
      )}
      
      <CompareContainer cardCount={pinnedCardData.length}>
        {pinnedCardData.map((card, index) => (
          <CardCompareItem key={index} cardCount={pinnedCardData.length}>
            <div style={{ textAlign: 'center' }}>
              <TypographyShadow variant={pinnedCardData.length > 3 ? "subtitle1" : "h6"} gutterBottom>
                {card.name}
              </TypographyShadow>
              <CardImage 
                src={card.image} 
                alt={card.name}
                cardCount={pinnedCardData.length}
              />
              {renderBothSides && card.backImage && (
                <CardImage 
                  src={card.backImage} 
                  alt={`${card.name} back`}
                  cardCount={pinnedCardData.length}
                />
              )}
            </div>
            
            {renderCardStats(card)}
            
            <div style={{ 
              marginTop: 10, 
              fontSize: pinnedCardData.length > 4 ? 13 : 14, 
              color: '#bbb',
              lineHeight: 1.4
            }}>
              <div style={{ marginBottom: 4 }}><strong>Type:</strong> {card.type}</div>
              <div style={{ marginBottom: 4 }}><strong>CMC:</strong> {card.cmc}</div>
              <div style={{ marginBottom: 4 }}><strong>Rarity:</strong> {card.rarity}</div>
              {card.keywords && card.keywords.length > 0 && (
                <div><strong>Keywords:</strong> {card.keywords.join(', ')}</div>
              )}
            </div>
          </CardCompareItem>
        ))}
      </CompareContainer>
    </div>
  );
};

export default CompareView;