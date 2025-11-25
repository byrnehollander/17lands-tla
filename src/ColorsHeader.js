import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
import React from "react";
import styled from "styled-components";
import { ReactComponent as Black } from "./assets/black.svg";
import { ReactComponent as Blue } from "./assets/blue.svg";
import { ReactComponent as Colorless } from "./assets/colorless.svg";
import { ReactComponent as Green } from "./assets/green.svg";
import { ReactComponent as Red } from "./assets/red.svg";
import { ReactComponent as White } from "./assets/white.svg";
import { TypographyShadowNoMargin } from "./sharedStyles";

const Container = styled.div`
  display: flex;
  align-items: end;
  margin-bottom: 15px;
`;

const SelectedIconButton = styled(IconButton)`
  opacity: 1;
  :hover {
    opacity: 0.9;
  }
`;

const UnselectedIconButton = styled(IconButton)`
  opacity: 0.4;
  :hover {
    opacity: 0.9;
  }
`;

const ButtonContainer = styled.div`
  margin-top: 40px;
`;

const ColorsHeader = ({ setColors, colors }) => {
  const toggleColor = (color) => {
    const newColors = new Set(colors);
    if (colors.has(color)) {
      newColors.delete(color);
    } else {
      newColors.add(color);
    }
    setColors(newColors);
  };

  return (
    <ButtonContainer>
      <Container>
        <Tooltip
          title="All colors are selected by default"
          placement="top-start"
        >
          <TypographyShadowNoMargin variant="h6" gutterBottom>
            COLORS
          </TypographyShadowNoMargin>
        </Tooltip>
        {colors.size === 0 ? (
          <Button
            size="small"
            variant="outlined"
            style={{
              marginLeft: 20,
              color: "white",
              border: "1px solid rgba(255, 255, 255, 0.23)",
            }}
            onClick={() => setColors(new Set(["C", "R", "G", "B", "U", "W"]))}
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
            onClick={() => setColors(new Set())}
          >
            Clear
          </Button>
        )}
      </Container>
      <Tooltip title="White" placement="bottom">
        {colors.has("W") ? (
          <SelectedIconButton
            onClick={() => toggleColor("W")}
            aria-label="White Mana"
            component="span"
          >
            <White
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(254 251 213 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("W")}
            aria-label="White Mana"
            component="span"
          >
            <White width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Blue" placement="bottom">
        {colors.has("U") ? (
          <SelectedIconButton
            onClick={() => toggleColor("U")}
            aria-label="Blue Mana"
            component="span"
          >
            <Blue
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(170 224 250 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("U")}
            aria-label="Blue Mana"
            component="span"
          >
            <Blue width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Black" placement="bottom">
        {colors.has("B") ? (
          <SelectedIconButton
            onClick={() => toggleColor("B")}
            aria-label="Black Mana"
            component="span"
          >
            <Black
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(202 194 190 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("B")}
            aria-label="Black Mana"
            component="span"
          >
            <Black width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Red" placement="bottom">
        {colors.has("R") ? (
          <SelectedIconButton
            onClick={() => toggleColor("R")}
            aria-label="Red Mana"
            component="span"
          >
            <Red
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(249 170 143 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("R")}
            aria-label="Red Mana"
            component="span"
          >
            <Red width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Green" placement="bottom">
        {colors.has("G") ? (
          <SelectedIconButton
            onClick={() => toggleColor("G")}
            aria-label="Green Mana"
            component="span"
          >
            <Green
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(155 211 174 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("G")}
            aria-label="Green Mana"
            component="span"
          >
            <Green width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
      <Tooltip title="Colorless" placement="bottom">
        {colors.has("C") ? (
          <SelectedIconButton
            onClick={() => toggleColor("C")}
            aria-label="Colorless Mana"
            component="span"
          >
            <Colorless
              width={50}
              style={{
                boxShadow: "0 0 10px 3px rgb(203 193 191 / 50%)",
                borderRadius: 100,
              }}
            />
          </SelectedIconButton>
        ) : (
          <UnselectedIconButton
            onClick={() => toggleColor("C")}
            aria-label="Colorless Mana"
            component="span"
          >
            <Colorless width={50} />
          </UnselectedIconButton>
        )}
      </Tooltip>
    </ButtonContainer>
  );
};

export default ColorsHeader;
