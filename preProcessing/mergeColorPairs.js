const cards = require("./cardsInfo.json");
const parse = require("./parseHtml");
const bg = require("./colors/bg");
const br = require("./colors/br");
const overall = require("./colors/overall");
const rg = require("./colors/rg");
const ub = require("./colors/ub");
const ug = require("./colors/ug");
const ur = require("./colors/ur");
const wb = require("./colors/wb");
const wg = require("./colors/wg");
const wr = require("./colors/wr");
const wu = require("./colors/wu");

const all = parse(overall);
const golgari = parse(bg);
const rakdos = parse(br);
const gruul = parse(rg);
const dimir = parse(ub);
const simic = parse(ug);
const izzet = parse(ur);
const orzhov = parse(wb);
const selesnya = parse(wg);
const boros = parse(wr);
const azorious = parse(wu);

const saveWinRates = () => {
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

  for (let i = 0; i < all.length; i++) {
    const { card, gihWR, count } = all[i];
    if (dict[card]) {
      dict[card].gihWRByColors["Overall"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < golgari.length; i++) {
    const { card, gihWR, count } = golgari[i];
    if (dict[card]) {
      dict[card].gihWRByColors["BG"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < rakdos.length; i++) {
    const { card, gihWR, count } = rakdos[i];
    if (dict[card]) {
      dict[card].gihWRByColors["BR"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < gruul.length; i++) {
    const { card, gihWR, count } = gruul[i];
    if (dict[card]) {
      dict[card].gihWRByColors["RG"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < dimir.length; i++) {
    const { card, gihWR, count } = dimir[i];
    if (dict[card]) {
      dict[card].gihWRByColors["UB"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < simic.length; i++) {
    const { card, gihWR, count } = simic[i];
    if (dict[card]) {
      dict[card].gihWRByColors["UG"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < izzet.length; i++) {
    const { card, gihWR, count } = izzet[i];
    if (dict[card]) {
      dict[card].gihWRByColors["UR"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < orzhov.length; i++) {
    const { card, gihWR, count } = orzhov[i];
    if (dict[card]) {
      dict[card].gihWRByColors["WB"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < selesnya.length; i++) {
    const { card, gihWR, count } = selesnya[i];
    if (dict[card]) {
      dict[card].gihWRByColors["WG"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < boros.length; i++) {
    const { card, gihWR, count } = boros[i];
    if (dict[card]) {
      dict[card].gihWRByColors["WR"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

  for (let i = 0; i < azorious.length; i++) {
    const { card, gihWR, count } = azorious[i];
    if (dict[card]) {
      dict[card].gihWRByColors["WU"] = { gihWR: gihWR, gihWRCount: count };
    }
  }

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

module.exports = saveWinRates;
