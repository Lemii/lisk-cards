import { CardMap, Rarity } from '../types';

type Props = {
	[x: string]: {
		colorTypes: number[];
		weight: number;
		stars: number;
	};
};

export const props: Props = {
	[Rarity.legendary]: {
		colorTypes: [1, 2],
		weight: 1,
		stars: 5,
	},
	[Rarity.epic]: { colorTypes: [10, 11], weight: 4, stars: 4 },
	[Rarity.rare]: { colorTypes: [2, 3, 4, 5, 6, 7, 8, 9], weight: 15, stars: 3 },
	[Rarity.uncommon]: { colorTypes: [2, 3, 4, 5, 6, 7, 8, 9], weight: 30, stars: 2 },
	[Rarity.common]: { colorTypes: [2, 3, 4, 5, 6, 7, 8, 9], weight: 50, stars: 1 },
};

const cards: [string, Rarity][] = [
	['Max', Rarity.legendary],
	['Oliver', Rarity.legendary],
	['Lisk Logo', Rarity.epic],
	['Juan', Rarity.epic],
	['4-6 Weeks', Rarity.rare],
	['Minion', Rarity.rare],
	['Rocket', Rarity.uncommon],
	['Moon', Rarity.uncommon],
	['Lambo', Rarity.uncommon],
	['Pirate', Rarity.common],
	['Cactus', Rarity.common],
	['Siberian Cat', Rarity.common],
	['Grumpy Cat', Rarity.common],
	['Elon Musk', Rarity.common],
];

export const getCards = (): CardMap => {
	const cardMap: CardMap = {
		[Rarity.legendary]: [],
		[Rarity.epic]: [],
		[Rarity.rare]: [],
		[Rarity.uncommon]: [],
		[Rarity.common]: [],
	};

	cards.forEach(([name, rarity], i) => {
		const data = { name, imageType: i + 1, rarity, ...props[rarity] };
		cardMap[rarity].push(data);
	});

	return cardMap;
};
