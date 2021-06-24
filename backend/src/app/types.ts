export type CardMetadata = {
	name: string;
	rarity: Rarity;
	imageType: number;
	colorTypes: number[];
	weight: number;
	stars: number;
};

export type CardMap = {
	[key: string]: CardMetadata[];
};

export type LiskCard = {
	id: string;
	code: string;
	owner: string;
	forSale: boolean;
	price: number;
	timesSold: number;
	dateMinted: string;
};

export enum Rarity {
	legendary = 'LEGENDARY',
	epic = 'EPIC',
	rare = 'RARE',
	uncommon = 'UNCOMMON',
	common = 'COMMON',
}

export interface LCAccountProps {
	lc: {
		cards: { id: string; code: string }[];
	};
}

export interface Account {
	address: string;
	token: {
		balance: string;
	};
	sequence: {
		nonce: string;
	};
	keys: {
		numberOfSignatures: number;
		mandatoryKeys: any[];
		optionalKeys: any[];
	};
	dpos: {
		delegate: {
			username: string;
			pomHeights: any[];
			consecutiveMissedBlocks: number;
			lastForgedHeight: number;
			isBanned: boolean;
			totalVotesReceived: string;
		};
		sentVotes: any[];
		unlocking: any[];
	};
	lc: {
		cards: { id: string; code: string }[];
	};
}

export interface LcStore {
	cards: LiskCard[];
	graveyard: LiskCard[];
}

// Record<string, never> is recommended over an empty object '{}'
export type MintAssetProps = Record<string, never>;

export type SellAssetProps = {
	id: string;
	price: number;
};

export type BuyAssetProps = {
	id: string;
};

export type DestroyAssetProps = {
	id: string;
};

export type CancelAssetProps = {
	id: string;
};
