import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import styled from "styled-components";
import { TypographyShadowNoMargin } from "./sharedStyles";
import { EXPANSION_CODE } from "./shared";

const SET_CODE = EXPANSION_CODE.toLocaleLowerCase();

const FlexEndContainer = styled.div`
  display: flex;
  align-items: end;
  margin-bottom: 15px;
`;

const SetIconLarge = styled.span`
  font-size: 40px;
`;

const SelectedRarityIconButton = styled(IconButton)``;

const UnselectedIconButton = styled(IconButton)`
  opacity: 0.4;
  :hover {
    opacity: 0.9;
  }
`;

const RarityContainer = styled.div`
  margin-top: 40px;
  margin-left: 50px;
  @media only screen and (max-width: 1300px) {
    margin-left: 0px;
  }
`;

const RaritiesHeader = ({ setRarities, rarities }) => {
  const toggleRarity = (rarity) => {
    const newRarities = new Set(rarities);
    if (rarities.has(rarity)) {
      newRarities.delete(rarity);
    } else {
      newRarities.add(rarity);
    }
    setRarities(newRarities);
  };

  return (
    <RarityContainer>
      <FlexEndContainer>
        <Tooltip
          title="All rarities are selected by default"
          placement="top-start"
        >
          <TypographyShadowNoMargin variant="h6" gutterBottom>
            RARITIES
          </TypographyShadowNoMargin>
        </Tooltip>
        {rarities.size === 0 ? (
          <Button
            size="small"
            variant="outlined"
            style={{
              marginLeft: 20,
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.23)",
            }}
            onClick={() =>
              setRarities(new Set(["common", "uncommon", "rare", "mythic"]))
            }
          >
            SELECT ALL
          </Button>
        ) : (
          <Button
            size="small"
            variant="outlined"
            style={{
              marginLeft: 20,
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.23)",
            }}
            onClick={() => setRarities(new Set())}
          >
            Clear
          </Button>
        )}
      </FlexEndContainer>
      <Tooltip title="Common" placement="bottom">
        {rarities.has("common") ? (
          <SelectedRarityIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("common")}
            aria-label="Common Cards"
            component="span"
          >
            <SetIconLarge
              className={`selected-rarity ss ss-common ss-grad ss-${SET_CODE}`}
            />
          </SelectedRarityIconButton>
        ) : (
          <UnselectedIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("common")}
            aria-label="Common Cards"
            component="span"
          >
            <SetIconLarge className={`ss ss-common ss-grad ss-${SET_CODE}`} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Uncommon" placement="bottom">
        {rarities.has("uncommon") ? (
          <SelectedRarityIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("uncommon")}
            aria-label="Uncommon Cards"
            component="span"
          >
            <SetIconLarge
              className={`selected-rarity ss ss-uncommon ss-grad ss-${SET_CODE}`}
            />
          </SelectedRarityIconButton>
        ) : (
          <UnselectedIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("uncommon")}
            aria-label="Uncommon Cards"
            component="span"
          >
            <SetIconLarge className={`ss ss-uncommon ss-grad ss-${SET_CODE}`} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Rare" placement="bottom">
        {rarities.has("rare") ? (
          <SelectedRarityIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("rare")}
            aria-label="Rare Cards"
            component="span"
          >
            <SetIconLarge
              className={`selected-rarity ss ss-rare ss-grad ss-${SET_CODE}`}
            />
          </SelectedRarityIconButton>
        ) : (
          <UnselectedIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("rare")}
            aria-label="Rare Cards"
            component="span"
          >
            <SetIconLarge className={`ss ss-rare ss-grad ss-${SET_CODE}`} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Mythic" placement="bottom">
        {rarities.has("mythic") ? (
          <SelectedRarityIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("mythic")}
            aria-label="Mythic Cards"
            component="span"
          >
            <SetIconLarge
              className={`selected-rarity ss ss-mythic ss-grad ss-${SET_CODE}`}
            />
          </SelectedRarityIconButton>
        ) : (
          <UnselectedIconButton
            style={{ width: 74, height: 74 }}
            onClick={() => toggleRarity("mythic")}
            aria-label="Mythic Cards"
            component="span"
          >
            <SetIconLarge className={`ss ss-mythic ss-grad ss-${SET_CODE}`} />
          </UnselectedIconButton>
        )}
      </Tooltip>
    </RarityContainer>
  );
};

export default RaritiesHeader;
