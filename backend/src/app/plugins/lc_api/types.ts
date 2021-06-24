import { LiskCard } from '../../types';

export interface Statistics {
	highestPriceSoldCard: LiskCard | undefined;
	mostSoldCard: LiskCard | undefined;
	rarestCard: LiskCard | undefined;
}

export enum UpdateType {
	mint = 'MINT',
	sold = 'SOLD',
}
