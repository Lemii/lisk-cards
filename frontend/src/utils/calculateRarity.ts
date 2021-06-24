import { rarityImages, rarityColors } from "../constants";
import { CodeVariables, Rarity } from "../types";

export const calculateRarity = (codeVariables: CodeVariables) => {
  let score: number = 0;
  let cardRarity: string = "";

  score = codeVariables.stars;
  score += rarityColors[codeVariables.color];
  score += rarityImages[codeVariables.image];

  switch (score) {
    case 3:
    case 4:
    case 5:
      cardRarity = Rarity.common;
      break;
    case 6:
    case 7:
    case 8:
      cardRarity = Rarity.uncommon;
      break;
    case 9:
    case 10:
    case 11:
      cardRarity = Rarity.rare;
      break;
    case 12:
    case 13:
      cardRarity = Rarity.epic;
      break;
    case 14:
    case 15:
      cardRarity = Rarity.legendary;
  }
  return cardRarity.toLocaleLowerCase();
};
