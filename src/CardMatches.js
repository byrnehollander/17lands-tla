import React, { useMemo } from "react";
import Fuse from "fuse.js";
import CardImages from "./CardImages";
import CompareView from "./CompareView";
import styled from "styled-components";
import { TypographyShadow } from "./sharedStyles";
import cards from "./ratingsPairs.json";

const LIMIT = 500;

const FlexContainer = styled.div`
  display: flex;
  flex-flow: row wrap;
`;

const hasColor = (card, colors) => {
  const colorless = ["C"];
  let cardColors = card.colors || colorless;
  if (cardColors?.length === 0) {
    cardColors = colorless;
  }
  return cardColors.some((c) => colors.has(c));
};

const hasRarity = (card, rarities) => {
  return rarities.has(card.rarity);
};

const options = {
  keys: ["name", "keywords", "type"],
  threshold: 0.3,
};

const CardMatches = ({ 
  searchTerm, 
  rarities, 
  colors, 
  renderBothSides, 
  pinnedCards, 
  togglePinCard, 
  showCompareView, 
  selectedArchetype,
  enableArchetypeFiltering 
}) => {
  const fuse = useMemo(() => new Fuse(cards, options), []);
  const matches = useMemo(() => {
    let filteredCards = cards;
    
    // Apply archetype filtering only if enabled and not "Overall"
    if (enableArchetypeFiltering && selectedArchetype !== 'Overall') {
      filteredCards = cards.filter(card => {
        const archetypeData = card.gihWRByColors?.[selectedArchetype];
        return archetypeData && archetypeData.gihWRCount > 100; // MIN_COUNT threshold
      });
    }
    
    if (searchTerm.length > 0) {
      const fuseResults = fuse.search(searchTerm).map((i) => i.item);
      return fuseResults.filter((c) => 
        filteredCards.includes(c) && hasColor(c, colors) && hasRarity(c, rarities)
      );
    } else {
      return filteredCards
        .filter((c) => hasColor(c, colors) && hasRarity(c, rarities))
        .slice(0, LIMIT);
    }
  }, [searchTerm, rarities, colors, fuse, enableArchetypeFiltering, selectedArchetype]);

  const sortedCards = useMemo(
    () =>
      matches
        .sort((a, b) => a.name.localeCompare(b.name))
        .sort(
          (a, b) => {
            // Use selected archetype for sorting if available and not Overall
            const archetypeKey = selectedArchetype === 'Overall' ? 'Overall' : selectedArchetype;
            const aWinRate = a.gihWRByColors?.[archetypeKey]?.gihWR || a.gihWRByColors?.Overall?.gihWR || 0;
            const bWinRate = b.gihWRByColors?.[archetypeKey]?.gihWR || b.gihWRByColors?.Overall?.gihWR || 0;
            return bWinRate - aWinRate;
          }
        ),
    [matches, selectedArchetype]
  );
  // const sortedCards = useMemo(() => matches.sort((a, b) => a.name.localeCompare(b.name)).sort((a, b) => parseFloat(b.gihWR.substring(0, 4)) - parseFloat(a.gihWR.substring(0, 4))), [matches])
  // const sortedCards = [];

  // Show comparison view if enabled
  if (showCompareView) {
    return (
      <CompareView 
        pinnedCards={pinnedCards}
        selectedArchetype={selectedArchetype}
        renderBothSides={renderBothSides}
      />
    );
  }

  if (matches.length === 0) {
    return (
      <TypographyShadow variant="h6" gutterBottom>
        No cards match your filters
      </TypographyShadow>
    );
  }

  if (sortedCards?.length > 0) {
    return (
      <>
        {sortedCards?.length > 2 && (
          <TypographyShadow variant="h6" gutterBottom>
            Showing {sortedCards.length} cards
          </TypographyShadow>
        )}
        <FlexContainer>
          <CardImages 
            cards={sortedCards} 
            renderBothSides={renderBothSides}
            pinnedCards={pinnedCards}
            togglePinCard={togglePinCard}
            selectedArchetype={selectedArchetype}
          />
        </FlexContainer>
      </>
    );
  }
};

export default CardMatches;
