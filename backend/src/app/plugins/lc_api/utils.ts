import * as fs from 'fs-extra';
import * as path from 'path';
import * as os from 'os';
import { LiskCard } from '../../types';
import { Statistics, UpdateType } from './types';
import { calculateRarity } from '../../utils/rarityCalculation';

const buildPath = async (fileName: string, dataPath = '~/.lisk/lisk-cards/') => {
	const p = path.join(dataPath.replace('~', os.homedir()), 'plugins/data', fileName);
	await fs.ensureFile(p);
	return p;
};

const getPaths = async () => {
	const newestCardFile = await buildPath('lc_newest_card.json');
	const statisticsFile = await buildPath('lc_statistics.json');

	return { newestCardFile, statisticsFile };
};

export const saveData = async (newestCard?: LiskCard, statistics?: Statistics) => {
	const { newestCardFile, statisticsFile } = await getPaths();

	const promises: Promise<void>[] = [];

	if (newestCard) {
		promises.push(fs.writeFile(newestCardFile, JSON.stringify(newestCard)));
	}

	if (statistics) {
		promises.push(fs.writeFile(statisticsFile, JSON.stringify(statistics)));
	}

	return Promise.all(promises);
};

export const loadData = async (): Promise<{
	card: LiskCard | undefined;
	statistics: Statistics;
}> => {
	const { newestCardFile, statisticsFile } = await getPaths();

	let card: LiskCard | undefined;
	let statistics!: Statistics;

	try {
		const file: string | undefined = fs.readFileSync(newestCardFile).toString();
		card = JSON.parse(file) as LiskCard;
	} catch (err) {
		card = undefined;
	}

	try {
		const file: string | undefined = fs.readFileSync(statisticsFile).toString();
		statistics = JSON.parse(file) as Statistics;
	} catch (err) {
		statistics = {
			highestPriceSoldCard: undefined,
			mostSoldCard: undefined,
			rarestCard: undefined,
		};
	}

	return { card, statistics };
};

export const updateStatistics = (
	statistics: Statistics,
	card: LiskCard,
	updateType: UpdateType,
) => {
	const updatedStats = { ...statistics };

	if (updateType === UpdateType.mint) {
		if (
			!updatedStats.rarestCard ||
			calculateRarity(card.code) > calculateRarity(updatedStats.rarestCard.code)
		) {
			updatedStats.rarestCard = card;
		}
	}

	if (updateType === UpdateType.sold) {
		if (
			!updatedStats.highestPriceSoldCard ||
			updatedStats.highestPriceSoldCard.price < card.price
		) {
			updatedStats.highestPriceSoldCard = card;
		}

		if (!updatedStats.mostSoldCard || updatedStats.mostSoldCard.timesSold < card.timesSold) {
			updatedStats.mostSoldCard = card;
		}
	}

	return updatedStats;
};
