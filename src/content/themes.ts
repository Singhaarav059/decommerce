// Storefront themes browsed on the clothing rack. One garment per theme
// (GLB node garment_<key>). Names describe the look; all are illustrative.

export type Theme = {
  key: "linen" | "olive" | "ink" | "terrazzo" | "kraft" | "stone" | "copper";
  name: string;
  note: string;
  /** Swatch for the low-tier list and the laptop preview. */
  swatch: string;
  /** Background + text for the laptop preview. */
  preview: { bg: string; ink: string; accent: string };
};

export const themes: Theme[] = [
  { key: "linen", name: "Linen", note: "Warm neutrals, serif headlines, big product photos", swatch: "#D7CDBE", preview: { bg: "#F5F2ED", ink: "#17150F", accent: "#C2602A" } },
  { key: "olive", name: "Olive grove", note: "Earthy greens for slow fashion and home goods", swatch: "#69714E", preview: { bg: "#EEEBE0", ink: "#252A1A", accent: "#69714E" } },
  { key: "ink", name: "Ink", note: "Dark, editorial, made for outerwear and leather", swatch: "#17150F", preview: { bg: "#17150F", ink: "#F5F2ED", accent: "#C2602A" } },
  { key: "terrazzo", name: "Terrazzo", note: "Speckled stone textures for lifestyle brands", swatch: "#C9B8A0", preview: { bg: "#E6DDCF", ink: "#17150F", accent: "#9A4718" } },
  { key: "kraft", name: "Kraft", note: "Unbleached paper tones for workwear and crafts", swatch: "#A8835C", preview: { bg: "#EFE6D8", ink: "#2B1F12", accent: "#8A5A2B" } },
  { key: "stone", name: "Stone", note: "Quiet, minimal, lets the product do the talking", swatch: "#E6DDCF", preview: { bg: "#FFFFFF", ink: "#17150F", accent: "#17150F" } },
  { key: "copper", name: "Copper", note: "One bold accent for launches and limited drops", swatch: "#C2602A", preview: { bg: "#F5F2ED", ink: "#17150F", accent: "#C2602A" } },
];
