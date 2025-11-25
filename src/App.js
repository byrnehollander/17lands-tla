import { useState } from "react";
import { useHotkeys } from "react-hotkeys-hook";
import styled from "styled-components";
import CardMatches from "./CardMatches";
import ColorsHeader from "./ColorsHeader";
import RaritiesHeader from "./RaritiesHeader";
import DescriptionBlock from "./DescriptionBlock";
import Search from "./Search";
import { TypographyShadow } from "./sharedStyles";
import "./App.css";
import "./Rune.css";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Button from "@mui/material/Button";

const Container = styled.div`
  margin: 5vw;
`;

const OptionsContainer = styled.div`
  display: flex;
  margin-bottom: 50px;
  @media only screen and (max-width: 1300px) {
    flex-direction: column;
  }
`;

const FixedToggle = styled.div`
  position: fixed;
  bottom: 20px;
  right: 20px;
  z-index: 1000;
  display: flex;
  gap: 10px;
`;

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [colors, setColors] = useState(new Set(["C", "R", "G", "B", "U", "W"]));
  const [rarities, setRarities] = useState(
    new Set(["common", "uncommon", "rare", "mythic"])
  );
  const [renderBothSides, setRenderBothSides] = useState(false);
  const [pinnedCards, setPinnedCards] = useState(new Set());
  const [showCompareView, setShowCompareView] = useState(false);
  const [selectedArchetype, setSelectedArchetype] = useState("Overall");
  const [enableArchetypeFiltering, setEnableArchetypeFiltering] =
    useState(false);

  const togglePinCard = (cardName) => {
    const newPinnedCards = new Set(pinnedCards);
    if (newPinnedCards.has(cardName)) {
      newPinnedCards.delete(cardName);
    } else {
      newPinnedCards.add(cardName);
    }
    setPinnedCards(newPinnedCards);
  };

  const clearPinnedCards = () => {
    setPinnedCards(new Set());
    setShowCompareView(false);
  };

  const handleArchetypeChange = (archetype) => {
    setSelectedArchetype(archetype);
  };

  const clearAllAndExit = () => {
    setSearchTerm("");
    setShowCompareView(false);
    setPinnedCards(new Set());
    setColors(new Set(["C", "R", "G", "B", "U", "W"]));
    setRarities(new Set(["common", "uncommon", "rare", "mythic"]));
    setSelectedArchetype("Overall");
    setEnableArchetypeFiltering(false);
  };

  useHotkeys("meta+escape", clearAllAndExit, {
    enableOnFormTags: ["input", "textarea", "select"],
  });

  return (
    <Container>
      <TypographyShadow variant="h3" gutterBottom>
        How good is this card?
      </TypographyShadow>
      <DescriptionBlock />
      <OptionsContainer>
        <ColorsHeader setColors={setColors} colors={colors} />
        <RaritiesHeader setRarities={setRarities} rarities={rarities} />
        <div
          style={{
            marginLeft: 50,
            marginTop: 90,
            display: "flex",
            flexDirection: "column",
            gap: 20,
          }}
        >
          <FormControlLabel
            control={
              <Switch
                checked={renderBothSides}
                onChange={(e) => setRenderBothSides(e.target.checked)}
              />
            }
            label="Show back of cards"
          />
          <FormControl
            variant="outlined"
            size="small"
            style={{ minWidth: 200 }}
          >
            <InputLabel>Archetype Focus</InputLabel>
            <Select
              value={selectedArchetype}
              onChange={(e) => handleArchetypeChange(e.target.value)}
              label="Archetype Focus"
            >
              <MenuItem value="Overall">Overall</MenuItem>
              <MenuItem value="WU">Azorius (WU)</MenuItem>
              <MenuItem value="UB">Dimir (UB)</MenuItem>
              <MenuItem value="BR">Rakdos (BR)</MenuItem>
              <MenuItem value="RG">Gruul (RG)</MenuItem>
              <MenuItem value="WG">Selesnya (WG)</MenuItem>
              <MenuItem value="WB">Orzhov (WB)</MenuItem>
              <MenuItem value="UR">Izzet (UR)</MenuItem>
              <MenuItem value="BG">Golgari (BG)</MenuItem>
              <MenuItem value="WR">Boros (WR)</MenuItem>
              <MenuItem value="UG">Simic (UG)</MenuItem>
            </Select>
          </FormControl>
          <FormControlLabel
            control={
              <Switch
                checked={enableArchetypeFiltering}
                onChange={(e) => setEnableArchetypeFiltering(e.target.checked)}
              />
            }
            label="Filter cards by archetype"
          />
          {pinnedCards.size > 0 && (
            <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowCompareView(!showCompareView)}
              >
                {showCompareView
                  ? "Exit Compare"
                  : `Compare (${pinnedCards.size})`}
              </Button>
              <Button
                variant="outlined"
                color="secondary"
                onClick={clearPinnedCards}
                size="small"
              >
                Clear All
              </Button>
            </div>
          )}
        </div>
      </OptionsContainer>
      <Search searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <CardMatches
        searchTerm={searchTerm}
        rarities={rarities}
        colors={colors}
        renderBothSides={renderBothSides}
        pinnedCards={pinnedCards}
        togglePinCard={togglePinCard}
        showCompareView={showCompareView}
        selectedArchetype={selectedArchetype}
        enableArchetypeFiltering={enableArchetypeFiltering}
      />
      <FixedToggle>
        <Button
          variant="contained"
          color={showCompareView ? "secondary" : "primary"}
          onClick={() => setShowCompareView(!showCompareView)}
          disabled={pinnedCards.size === 0}
        >
          {showCompareView
            ? "Exit Compare"
            : `Compare${pinnedCards.size > 0 ? ` (${pinnedCards.size})` : ""}`}
        </Button>
      </FixedToggle>
    </Container>
  );
}

export default App;
