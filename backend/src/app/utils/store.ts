import { BaseModuleDataAccess, codec, StateStore } from 'lisk-sdk';
import { CHAIN_STATE_LC, lcListSchema } from '../modules/lc/schemas';
import { LcStore, LiskCard } from '../types';

export const getStoreData = async (stateStore: StateStore): Promise<LcStore> => {
	const storeDataBuffer = await stateStore.chain.get(CHAIN_STATE_LC);

	const storeData = storeDataBuffer
		? codec.decode<{ cards: LiskCard[]; graveyard: LiskCard[] }>(lcListSchema, storeDataBuffer)
		: { cards: [] as LiskCard[], graveyard: [] as LiskCard[] };

	return storeData;
};

export const getModuleData = async (dataAccess: BaseModuleDataAccess): Promise<LcStore> => {
	const storeDataBuffer = await dataAccess.getChainState(CHAIN_STATE_LC);

	const storeData = storeDataBuffer
		? codec.decode<{ cards: LiskCard[]; graveyard: LiskCard[] }>(lcListSchema, storeDataBuffer)
		: { cards: [] as LiskCard[], graveyard: [] as LiskCard[] };

	return storeData;
};
