import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Accordion from "@mui/material/Accordion";
import AccordionDetails from "@mui/material/AccordionDetails";
import AccordionSummary from "@mui/material/AccordionSummary";
import Link from "@mui/material/Link";
import Tooltip from "@mui/material/Tooltip";
import Typography from "@mui/material/Typography";
import { withStyles } from "@mui/styles";
import React, { useMemo } from "react";
import { AVERAGE_WIN_RATE, WIN_RATES_BY_COLOR } from "./aggregateData";
import { SELECTED_FORMAT, EXPANSION_CODE } from "./shared";
import { LAST_RUN, START_DATE } from "./lastRun";
import { calculateDiffFromAverageWinRate } from "./helpers";

const SUPPORTED_ARCHETYPES = new Set([
  "Azorius (WU)",
  "Dimir (UB)",
  "Rakdos (BR)",
  "Gruul (RG)",
  "Selesnya (GW)",
]);
const ARCHETYPE_NAMES = {
  "Azorius (WU)": "Modified",
  "Dimir (UB)": "Villains Connive",
  "Rakdos (BR)": "Mayhem",
  "Gruul (RG)": "Large Spells",
  "Selesnya (GW)": "Web-slinging",
};

const StyledAccordionDetails = withStyles({
  root: {
    flexDirection: "column",
  },
})(AccordionDetails);

const DescriptionBlock = () => {
  const SORTED_WIN_RATES_BY_COLOR = useMemo(() => {
    const items = Object.keys(WIN_RATES_BY_COLOR).map(function (key) {
      return [key, WIN_RATES_BY_COLOR[key]];
    });

    return items.sort((first, second) => {
      return second[1] - first[1];
    });
  }, []);

  const renderWinRatesByColor = useMemo(() => {
    return SORTED_WIN_RATES_BY_COLOR.map((c, i) => {
      const diff = calculateDiffFromAverageWinRate(c[1]);
      const isSupported = SUPPORTED_ARCHETYPES.has(c[0]);

      return (
        <li key={i}>
          <div style={{ minWidth: 120, display: "inline-block" }}>
            {isSupported ? (
              <Tooltip title={ARCHETYPE_NAMES[c[0]]} arrow>
                <b style={{ cursor: "help" }}>
                  <i>{c[0]}</i>
                </b>
              </Tooltip>
            ) : (
              <i>{c[0]}</i>
            )}
            :
          </div>
          <div style={{ minWidth: 55, display: "inline-block" }}>
            {c[1].toFixed(1)}%
          </div>{" "}
          ({diff})
        </li>
      );
    });
  }, [SORTED_WIN_RATES_BY_COLOR]);

  return (
    <Accordion defaultExpanded={false} style={{ maxWidth: 980 }}>
      <AccordionSummary
        expandIcon={<ExpandMoreIcon />}
        aria-controls="panel1a-content"
        id="panel1a-header"
      >
        <Typography variant="h6" style={{ fontWeight: 400, fontSize: 16 }}>
          Learn more about this site
        </Typography>
      </AccordionSummary>
      <StyledAccordionDetails>
        <Typography
          variant="h6"
          gutterBottom
          style={{ maxWidth: 950, fontWeight: 400, fontSize: 16 }}
        >
          This site uses{" "}
          <Link
            color="textPrimary"
            onClick={(event) => event.preventDefault()}
            href="https://www.17lands.com/"
            target="_blank"
            rel="noopener noreferrer"
          >
            17Lands
          </Link>{" "}
          data to show how {EXPANSION_CODE} cards perform.
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          style={{ maxWidth: 950, fontWeight: 400, fontSize: 16 }}
        >
          All percentages are for the <b>Games In Hand Win Rate</b> (GIH WR)
          metric for {SELECTED_FORMAT.pretty} from {START_DATE} to {LAST_RUN}.
          This is the win rate of games where the card was drawn at some point
          (including in the opening hand). The number in square brackets is the
          difference from 17Lands users' average win rate. The number in
          parentheses is the number of games used to calculate the win rate
          (i.e., number of games where the card was ever in the player's hand).
          There seems to be some consensus that GIH WR is the best metric
          currently on 17Lands, but note that it is biased towards late game
          cards.
        </Typography>
        <Typography
          variant="h6"
          gutterBottom
          style={{ maxWidth: 950, fontWeight: 400, fontSize: 16 }}
        >
          Also note that the collective average win rate from 17Lands users is{" "}
          <b>{AVERAGE_WIN_RATE.toFixed(1)}%</b> (in {EXPANSION_CODE}{" "}
          {SELECTED_FORMAT.pretty}).
        </Typography>
        <Typography
          variant="h6"
          style={{ maxWidth: 950, fontWeight: 400, fontSize: 16 }}
        >
          Lastly, here are the win rates by color pair for 17Lands users
          (2-color decks + 2-color with splash decks). <b>Bolded archetypes</b>{" "}
          are the supported archetypes for this format:
          <ol>{renderWinRatesByColor}</ol>
        </Typography>
      </StyledAccordionDetails>
    </Accordion>
  );
};

export default DescriptionBlock;
