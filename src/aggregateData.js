import colorData from "./colorData.json";

export const WIN_RATES_BY_COLOR = {
  "Azorius (WU)": 0.5555555556,
  "Dimir (UB)": 0.5341282895,
  "Rakdos (BR)": 0.5464898178,
  "Gruul (RG)": 0.5636743215,
  "Selesnya (GW)": 0.5668421947,
  "Orzhov (WB)": 0.5554956897,
  "Golgari (BG)": 0.5397440869,
  "Simic (GU)": 0.5706363876,
  "Izzet (UR)": 0.5321888412,
  "Boros (RW)": 0.5344177275,
};

export let AVERAGE_WIN_RATE = 0.5494987941;

for (const [key, value] of Object.entries(colorData)) {
  if (key !== "All Decks") {
    WIN_RATES_BY_COLOR[key] = value * 100;
  } else {
    AVERAGE_WIN_RATE = value * 100;
  }
}
