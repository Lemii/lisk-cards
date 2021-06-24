import * as seedrandom from 'seedrandom';
import { getCards } from './cards';
import { CardMetadata, LiskCard, Rarity } from '../types';

const getRandomArrayElement = <T>(arr: T[], seed: string) =>
	arr[Math.floor(getPseudoRandomNumber(seed) * arr.length)];

const getCardCode = (card: CardMetadata, seed: string) => {
	const colorType = getRandomArrayElement<number>(card.colorTypes, seed);
	return `c${colorType}s${card.stars}i${card.imageType}`;
};

const getPseudoRandomNumber = (hex: string): number => {
	const rng = seedrandom(hex);
	return rng();
};

export const mintRandomCard = (owner: string, transactionId: string): LiskCard => {
	const cards = getCards();

	const pseudoRandomNumber = getPseudoRandomNumber(transactionId);
	const number = Math.floor(pseudoRandomNumber * 100) + 1;

	let chosenCard!: CardMetadata;

	const cardSeed = transactionId.substring(transactionId.length - 5);
	const colorSeed = transactionId.substring(0, 5);

	if (number === 1) {
		chosenCard = getRandomArrayElement<CardMetadata>(cards[Rarity.legendary], cardSeed);
	} else if (number < 5) {
		chosenCard = getRandomArrayElement<CardMetadata>(cards[Rarity.epic], cardSeed);
	} else if (number < 20) {
		chosenCard = getRandomArrayElement<CardMetadata>(cards[Rarity.rare], cardSeed);
	} else if (number < 50) {
		chosenCard = getRandomArrayElement<CardMetadata>(cards[Rarity.uncommon], cardSeed);
	} else {
		chosenCard = getRandomArrayElement<CardMetadata>(cards[Rarity.common], cardSeed);
	}

	return {
		code: getCardCode(chosenCard, colorSeed),
		id: transactionId,
		owner,
		forSale: false,
		price: 0,
		timesSold: 0,
		dateMinted: BigInt(Date.now()).toString(),
	};
};
