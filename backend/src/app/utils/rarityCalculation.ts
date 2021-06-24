import { rarityColors, rarityImages } from '../constants';

export const extractCode = (code: string) => {
	// extract the color, stars and image from the simple code string, example:c7s1i11
	let a: string[] = [];
	let b: string[] = [];
	a = code.split('s');
	b = a[0].split('c');
	const color = +b[1];
	a = code.split('s');
	b = a[1].split('i');
	const stars = +b[0];
	const image = +b[1];

	const codeVariables = {
		color,
		stars,
		image,
	};

	return codeVariables;
};

export const calculateRarity = (code: string) => {
	const codeVariables = extractCode(code);
	let score = 0;

	score = codeVariables.stars;
	score += rarityColors[codeVariables.color];
	score += rarityImages[codeVariables.image];

	return score;
};
