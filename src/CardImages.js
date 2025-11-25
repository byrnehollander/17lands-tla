import React, { useMemo } from "react";
import { isMobile } from "react-device-detect";
import Tilty from "react-tilty";
import styled from "styled-components";
import Tooltip from "@mui/material/Tooltip";
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
  calculateDiffFromAverageWUWinRate,
} from "./helpers";

const MobileCardsContainer = styled.div`
  display: flex;
  margin-bottom: 40px;
  min-width: 90vw;
`;

const MIN_COUNT = 100;

const PinButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: ${(props) => (props.isPinned ? "#ff6b6b" : "rgba(0, 0, 0, 0.7)")};
  color: white;
  border: none;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  font-size: 18px;
  cursor: pointer;
  z-index: 10;
  transition: all 0.2s ease;

  &:hover {
    transform: scale(1.1);
    background: ${(props) =>
      props.isPinned ? "#e55555" : "rgba(0, 0, 0, 0.9)"};
  }
`;

const CardContainer = styled.div`
  position: relative;
`;

const ArchetypeHighlight = styled.div`
  background-color: #2d4aa7;
  padding: 2px 6px;
  border-radius: 3px;
  font-weight: bold;
  display: inline-block;
`;

const CardsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(
    auto-fit,
    minmax(
      ${(props) => {
        if (props.columns <= 2) return "380px";
        if (props.columns === 3) return "320px";
        if (props.columns === 4) return "280px";
        return "250px";
      }},
      1fr
    )
  );
  gap: 20px;
  width: 100%;
  justify-content: center;
`;

const CardWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const CardImages = ({
  cards,
  renderBothSides,
  pinnedCards,
  togglePinCard,
  selectedArchetype,
}) => {
  const { cardSize, columns } = useMemo(() => {
    const count = cards?.length || 0;
    if (count <= 2) return { cardSize: "large", columns: 2 };
    if (count <= 4) return { cardSize: "medium", columns: 3 };
    if (count <= 8) return { cardSize: "small", columns: 4 };
    return { cardSize: "compact", columns: 5 };
  }, [cards]);

  const renderRows = (gihWRByColors) => {
    const items = Object.keys(gihWRByColors).map(function (key) {
      return [key, gihWRByColors[key]];
    });

    items.sort(function (first, second) {
      return parseFloat(second[1].gihWR) - parseFloat(first[1].gihWR);
    });

    return items.map((item, i) => {
      const [colorPairName, color] = item;
      if (color.gihWRCount > MIN_COUNT && color.gihWR) {
        let func = calculateDiffFromAverageWinRate;
        if (colorPairName === "BG") {
          func = calculateDiffFromAverageBGWinRate;
        } else if (colorPairName === "BR") {
          func = calculateDiffFromAverageBRWinRate;
        } else if (colorPairName === "RG") {
          func = calculateDiffFromAverageRGWinRate;
        } else if (colorPairName === "UB") {
          func = calculateDiffFromAverageUBWinRate;
        } else if (colorPairName === "UG") {
          func = calculateDiffFromAverageUGWinRate;
        } else if (colorPairName === "UR") {
          func = calculateDiffFromAverageURWinRate;
        } else if (colorPairName === "WB") {
          func = calculateDiffFromAverageWBWinRate;
        } else if (colorPairName === "WG") {
          func = calculateDiffFromAverageWGWinRate;
        } else if (colorPairName === "WR") {
          func = calculateDiffFromAverageWRWinRate;
        } else if (colorPairName === "WU") {
          func = calculateDiffFromAverageWUWinRate;
        }
        const isSelectedArchetype = colorPairName === selectedArchetype;
        return (
          <div
            key={i}
            style={{
              marginBottom: 4,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "2px 0",
            }}
          >
            <div>
              {isSelectedArchetype ? (
                <ArchetypeHighlight>{colorPairName}:</ArchetypeHighlight>
              ) : (
                <span style={{ fontWeight: "bold" }}>{colorPairName}:</span>
              )}
            </div>
            <Tooltip title={`Sample size: ${color.gihWRCount} games`} arrow>
              <div style={{ cursor: "help" }}>
                <strong>{(color.gihWR * 100).toFixed(1)}%</strong>
                <span
                  style={{ marginLeft: 6, color: "#aaa", fontSize: "0.9em" }}
                >
                  [{func(color.gihWR * 100)}]
                </span>
              </div>
            </Tooltip>
          </div>
        );
      }
      return "";
    });
  };

  const getSizes = (cardSize) => {
    const sizes = {
      large: {
        imageWidth: 396,
        containerWidth: 386,
        marginLeft: 30,
        fontSize: 18,
        marginBottom: 70,
      },
      medium: {
        imageWidth: 320,
        containerWidth: 310,
        marginLeft: 20,
        fontSize: 17,
        marginBottom: 50,
      },
      small: {
        imageWidth: 288,
        containerWidth: 278,
        marginLeft: 10,
        fontSize: 16,
        marginBottom: 40,
      },
      compact: {
        imageWidth: 240,
        containerWidth: 230,
        marginLeft: 8,
        fontSize: 15,
        marginBottom: 30,
      },
    };
    return sizes[cardSize] || sizes.large;
  };

  const renderRatingAndDescription = (card, fontSize) => {
    const arr = [];
    if (card.gihWRByColors["Overall"]) {
      arr.push(
        <div
          style={{
            fontSize: fontSize,
            marginBottom: 5,
            backgroundColor: "#2a2a2a",
            padding: "12px",
            borderRadius: "6px",
            lineHeight: 1.4,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              marginBottom: 15,
              fontWeight: "bold",
              fontSize: Math.max(fontSize - 1, 13),
            }}
          >
            <div>
              <strong>ALSA:</strong>{" "}
              {card.gihWRByColors["Overall"]?.avgSeen
                ? card.gihWRByColors["Overall"].avgSeen.toFixed(2)
                : "N/A"}
            </div>
            <div>
              <strong>ATA:</strong>{" "}
              {card.gihWRByColors["Overall"]?.avgPick
                ? card.gihWRByColors["Overall"].avgPick.toFixed(2)
                : "N/A"}
            </div>
          </div>
          <div style={{ fontSize: Math.max(fontSize - 1, 14) }}>
            {renderRows(card.gihWRByColors)}
          </div>
        </div>
      );
    }
    return arr;
  };

  const renderSingleImage = (url, name, width) => {
    return <img src={url} alt={name} width={width} />;
  };

  const renderImage = (url, backUrl, name, width) => {
    if (renderBothSides && backUrl != null) {
      return (
        <>
          {renderSingleImage(url, name, width)}
          {renderSingleImage(backUrl, name, width)}
        </>
      );
    }
    return renderSingleImage(url, name, width);
  };

  if (isMobile) {
    return cards.map((c, i) => {
      const isPinned = pinnedCards && pinnedCards.has(c.name);
      return (
        <MobileCardsContainer key={i}>
          <CardContainer style={{ marginRight: 10, width: "fit-content" }}>
            {renderImage(c.image, c.backImage, c.name, 150)}
            {togglePinCard && (
              <PinButton
                isPinned={isPinned}
                onClick={() => togglePinCard(c.name)}
                style={{ width: 30, height: 30, fontSize: 14 }}
              >
                {isPinned ? "📌" : "📎"}
              </PinButton>
            )}
          </CardContainer>
          <div style={{ width: "calc(90vw-155)", marginLeft: 5, marginTop: 8 }}>
            {renderRatingAndDescription(c, 14)}
          </div>
        </MobileCardsContainer>
      );
    });
  }
  const sizes = getSizes(cardSize);

  return (
    <CardsGrid columns={columns}>
      {cards.map((c, i) => {
        const isPinned = pinnedCards && pinnedCards.has(c.name);
        return (
          <CardWrapper key={i}>
            <CardContainer>
              <Tilty
                scale={cardSize === "compact" ? 1.02 : 1.05}
                max={cardSize === "compact" ? 4 : 8}
                style={{ marginBottom: 15 }}
              >
                {renderImage(c.image, c.backImage, c.name, sizes.imageWidth)}
              </Tilty>
              {togglePinCard && (
                <PinButton
                  isPinned={isPinned}
                  onClick={() => togglePinCard(c.name)}
                >
                  {isPinned ? "📌" : "📎"}
                </PinButton>
              )}
            </CardContainer>
            <div
              style={{
                width: "100%",
                maxWidth: sizes.containerWidth,
                marginBottom: sizes.marginBottom,
              }}
            >
              {renderRatingAndDescription(c, sizes.fontSize)}
            </div>
          </CardWrapper>
        );
      })}
    </CardsGrid>
  );
};

export default CardImages;
