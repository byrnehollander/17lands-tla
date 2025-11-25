export const EXPANSION_CODE = "TLA";

export const FORMATS = {
  PREMIER_DRAFT: {
    slug: "PremierDraft",
    pretty: "Premier Draft",
  },
  SEALED: {
    slug: "Sealed",
    pretty: "Sealed",
  },
  TRAD_SEALED: {
    slug: "TradSealed",
    pretty: "Trad Sealed",
  },
  PICK_TWO_DRAFT: {
    slug: "PickTwoDraft",
    pretty: "Pick Two Draft",
  },
  PICK_TWO_TRAD_DRAFT: {
    slug: "PickTwoTradDraft",
    pretty: "Pick Two Trad Draft",
  },
};

export const SELECTED_FORMAT = FORMATS.PICK_TWO_DRAFT;

// When true, preprocessing will fetch data from all formats and calculate weighted averages
// When false, preprocessing will only fetch data from SELECTED_FORMAT
export const USE_WEIGHTED_AVERAGE_ACROSS_FORMATS = false;
