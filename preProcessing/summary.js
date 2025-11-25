const fetch = require("node-fetch");
const { EXPANSION_CODE, SELECTED_FORMAT } = require("../src/shared");

const now = new Date();
const endDate = `${now.getFullYear()}-${now.getMonth() + 1}-${now.getDate()}`;

const startDate = "2025-11-15";
const COLORS_URL = `https://www.17lands.com/color_ratings/data?expansion=${EXPANSION_CODE}&event_type=${SELECTED_FORMAT.slug}&start_date=${startDate}&end_date=${endDate}&combine_splash=true`;

const colorNames = [
  "All Decks",
  "Azorius (WU)",
  "Dimir (UB)",
  "Rakdos (BR)",
  "Gruul (RG)",
  "Selesnya (GW)",
  "Orzhov (WB)",
  "Golgari (BG)",
  "Simic (GU)",
  "Izzet (UR)",
  "Boros (RW)",
  "Esper (WUB)",
  "Grixis (UBR)",
  "Jund (BRG)",
  "Naya (RGW)",
  "Bant (GWU)",
];

const main = async () => {
  const colors = await fetch(COLORS_URL);
  const colorData = await colors.json();
  const colorDict = {};
  const filtered = colorData.filter((r) => colorNames.includes(r.color_name));
  filtered.forEach((r) => {
    colorDict[r.color_name] = r.wins / r.games;
  });

  const arr = colorDict;

  require("fs").writeFile(
    "../src/colorData.json",
    JSON.stringify(arr),
    function (err) {
      if (err) {
        console.error("Broke!");
      }
    }
  );
};

main();
