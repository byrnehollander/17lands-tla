const fetch = require("node-fetch");
const reverseCards = require("./cardsInfo.json");
const {
  EXPANSION_CODE,
  SELECTED_FORMAT,
  FORMATS,
  USE_WEIGHTED_AVERAGE_ACROSS_FORMATS,
} = require("../src/shared");

// Calculate weighted average across formats for a single card
const calculateWeightedOverall = (cardFormatData) => {
  const validData = cardFormatData.filter(
    (data) =>
      data.gihWR !== null && data.gihWR !== undefined && data.gihWRCount > 0
  );

  if (validData.length === 0) return null;

  let totalWeighted = 0;
  let totalWeightedPick = 0;
  let totalWeightedSeen = 0;
  let totalCount = 0;

  validData.forEach((data) => {
    totalWeighted += data.gihWR * data.gihWRCount;
    totalWeightedPick += (data.avgPick || 0) * data.gihWRCount;
    totalWeightedSeen += (data.avgSeen || 0) * data.gihWRCount;
    totalCount += data.gihWRCount;
  });

  return {
    gihWR: totalWeighted / totalCount,
    gihWRCount: totalCount,
    avgPick: totalWeightedPick / totalCount,
    avgSeen: totalWeightedSeen / totalCount,
  };
};

const cards = reverseCards.reverse();

const now = new Date();
const threeWeeksAgo = new Date(now);
threeWeeksAgo.setDate(now.getDate() - 21);
const startDate = `${threeWeeksAgo.getFullYear()}-${String(
  threeWeeksAgo.getMonth() + 1
).padStart(2, "0")}-${String(threeWeeksAgo.getDate()).padStart(2, "0")}`;
const dayAfterTomorrow = new Date(now);
dayAfterTomorrow.setDate(now.getDate() + 2);
const endDate = `${dayAfterTomorrow.getFullYear()}-${String(
  dayAfterTomorrow.getMonth() + 1
).padStart(2, "0")}-${String(dayAfterTomorrow.getDate()).padStart(2, "0")}`;
const BASE_URL = `https://www.17lands.com/card_ratings/data?expansion=${EXPANSION_CODE}&format=${SELECTED_FORMAT.slug}&start_date=${startDate}&end_date=${endDate}`;
const COLORS_URL = `https://www.17lands.com/color_ratings/data?expansion=${EXPANSION_CODE}&event_type=${SELECTED_FORMAT.slug}&start_date=${startDate}&end_date=${endDate}&combine_splash=true`;
const COLOR_NAMES = [
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
];

const dateString = now.toDateString();
const splits = dateString.substr(4).split(" ");
const formatted = `${splits[0]} ${parseInt(splits[1])}, ${splits[2]}`;

const startDateString = threeWeeksAgo.toDateString();
const startSplits = startDateString.substr(4).split(" ");
const formattedStartDate = `${startSplits[0]} ${parseInt(startSplits[1])}, ${
  startSplits[2]
}`;

const main = async () => {
  require("fs").writeFile(
    "../src/lastRun.js",
    `export const LAST_RUN = ${JSON.stringify(formatted)}
export const START_DATE = ${JSON.stringify(formattedStartDate)}`,
    function (err) {
      if (err) {
        console.error("Broke!");
      }
    }
  );

  const colors = await fetch(COLORS_URL);
  const colorData = await colors.json();
  const colorDict = {};
  const filtered = colorData.filter((r) => COLOR_NAMES.includes(r.color_name));
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

  // Fetch data from formats based on USE_WEIGHTED_AVERAGE_ACROSS_FORMATS setting
  const buildFormatURL = (formatSlug) =>
    `https://www.17lands.com/card_ratings/data?expansion=${EXPANSION_CODE}&format=${formatSlug}&start_date=${startDate}&end_date=${endDate}`;

  let allFormatsData;

  if (USE_WEIGHTED_AVERAGE_ACROSS_FORMATS) {
    // Fetch from all formats and calculate weighted averages
    const formatPromises = Object.values(FORMATS).map((format) =>
      fetch(buildFormatURL(format.slug))
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => [])
    );

    const formatDataArrays = await Promise.all(formatPromises);
    allFormatsData = Object.values(FORMATS).map((format, index) => ({
      format: format.slug,
      data: formatDataArrays[index],
    }));
  } else {
    // Fetch only from selected format
    const formatData = await fetch(buildFormatURL(SELECTED_FORMAT.slug))
      .then((res) => (res.ok ? res.json() : []))
      .catch(() => []);

    allFormatsData = [
      {
        format: SELECTED_FORMAT.slug,
        data: formatData,
      },
    ];
  }

  // Color pairs to fetch data for
  const colorPairs = [
    "WU",
    "WB",
    "WR",
    "WG",
    "UB",
    "UR",
    "UG",
    "BR",
    "BG",
    "RG",
  ];

  // Fetch data for each color pair based on USE_WEIGHTED_AVERAGE_ACROSS_FORMATS setting
  const colorPairData = {};
  for (const colorPair of colorPairs) {
    if (USE_WEIGHTED_AVERAGE_ACROSS_FORMATS) {
      // Fetch from all formats
      const colorPairPromises = Object.values(FORMATS).map((format) =>
        fetch(`${buildFormatURL(format.slug)}&colors=${colorPair}`)
          .then((res) => (res.ok ? res.json() : []))
          .catch(() => [])
      );

      const colorPairFormatArrays = await Promise.all(colorPairPromises);
      colorPairData[colorPair] = Object.values(FORMATS).map(
        (format, index) => ({
          format: format.slug,
          data: colorPairFormatArrays[index],
        })
      );
    } else {
      // Fetch only from selected format
      const colorPairData_single = await fetch(
        `${buildFormatURL(SELECTED_FORMAT.slug)}&colors=${colorPair}`
      )
        .then((res) => (res.ok ? res.json() : []))
        .catch(() => []);

      colorPairData[colorPair] = [
        {
          format: SELECTED_FORMAT.slug,
          data: colorPairData_single,
        },
      ];
    }
  }

  const dict = {};

  for (let i = 0; i < cards.length; i++) {
    const { name, type, keywords, colors, cmc, rarity, image, backImage } =
      cards[i];
    const shortName = name.split(" // ")[0];
    dict[shortName] = {
      name,
      colors,
      keywords,
      cmc: parseInt(cmc),
      rarity,
      image,
      backImage,
      type,
      gihWRByColors: {},
    };
  }

  // Calculate weighted averages across all formats for each card
  const cardDataByName = {};

  // Collect data for each card from all formats
  allFormatsData.forEach(({ format, data }) => {
    data.forEach((cardInfo) => {
      const cardName = cardInfo.name;
      if (!cardDataByName[cardName]) cardDataByName[cardName] = [];

      if (
        cardInfo.ever_drawn_win_rate !== null &&
        cardInfo.ever_drawn_win_rate !== undefined
      ) {
        cardDataByName[cardName].push({
          gihWR: cardInfo.ever_drawn_win_rate,
          gihWRCount: cardInfo.ever_drawn_game_count || 0,
          avgPick: cardInfo.avg_pick || 0,
          avgSeen: cardInfo.avg_seen || 0,
        });
      }
    });
  });

  // Calculate and apply weighted averages for overall
  Object.entries(cardDataByName).forEach(([cardName, formatData]) => {
    const weightedData = calculateWeightedOverall(formatData);
    if (dict[cardName] && weightedData) {
      dict[cardName].gihWRByColors["Overall"] = weightedData;
    }
  });

  // Calculate weighted averages for each color pair
  colorPairs.forEach((colorPair) => {
    const cardDataByNameForColor = {};

    // Collect data for each card from all formats for this color pair
    colorPairData[colorPair].forEach(({ format, data }) => {
      data.forEach((cardInfo) => {
        const cardName = cardInfo.name;
        if (!cardDataByNameForColor[cardName])
          cardDataByNameForColor[cardName] = [];

        if (
          cardInfo.ever_drawn_win_rate !== null &&
          cardInfo.ever_drawn_win_rate !== undefined
        ) {
          cardDataByNameForColor[cardName].push({
            gihWR: cardInfo.ever_drawn_win_rate,
            gihWRCount: cardInfo.ever_drawn_game_count || 0,
            avgPick: cardInfo.avg_pick || 0,
            avgSeen: cardInfo.avg_seen || 0,
          });
        }
      });
    });

    // Calculate and apply weighted averages for this color pair
    Object.entries(cardDataByNameForColor).forEach(([cardName, formatData]) => {
      const weightedData = calculateWeightedOverall(formatData);
      if (dict[cardName] && weightedData) {
        dict[cardName].gihWRByColors[colorPair] = weightedData;
      }
    });
  });

  const arrayToWrite = [];

  // print the dictionary
  for (const [_, value] of Object.entries(dict)) {
    const {
      name,
      type,
      colors,
      keywords,
      cmc,
      rarity,
      image,
      backImage,
      gihWRByColors,
    } = value;
    arrayToWrite.push({
      name: name,
      colors: colors,
      keywords: keywords,
      cmc: parseInt(cmc),
      rarity: rarity,
      image: image,
      backImage: backImage,
      type: type,
      gihWRByColors: gihWRByColors,
    });
  }

  require("fs").writeFile(
    "../src/ratingsPairs.json",
    JSON.stringify(arrayToWrite),
    function (err) {
      if (err) {
        console.error("Broke!");
      }
    }
  );
};

main();
