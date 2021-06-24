/*
 * LiskHQ/lisk-commander
 * Copyright © 2021 Lisk Foundation
 *
 * See the LICENSE file at the top-level directory of this distribution
 * for licensing information.
 *
 * Unless otherwise agreed in a custom licensing agreement with the Lisk Foundation,
 * no part of this software, including this file, may be copied, modified,
 * propagated, or distributed except according to the terms contained in the
 * LICENSE file.
 *
 * Removal or modification of this copyright notice is prohibited.
 *
 */

/* eslint-disable class-methods-use-this */

import {
	AfterBlockApplyContext,
	AfterGenesisBlockApplyContext,
	BaseModule,
	BeforeBlockApplyContext,
	codec,
	TransactionApplyContext,
} from 'lisk-sdk';
import { BuyAssetProps, LiskCard } from '../../types';
import { getModuleData, getStoreData } from '../../utils/store';
import { BuyAsset } from './assets/buy_asset';
import { CancelAsset } from './assets/cancel_asset';
import { DestroyAsset } from './assets/destroy_asset';
import { MintAsset } from './assets/mint_asset';
import { SellAsset } from './assets/sell_asset';
import { accountSchema, buyAssetSchema, CHAIN_STATE_LC, lcListSchema } from './schemas';

export class LcModule extends BaseModule {
	public actions = {
		getState: async () => getModuleData(this._dataAccess),
	};

	public reducers = {};
	public name = 'lc';
	public transactionAssets = [
		new MintAsset(),
		new SellAsset(),
		new BuyAsset(),
		new DestroyAsset(),
		new CancelAsset(),
	];
	public events = ['cardMinted', 'cardSold'];
	public id = 1000;

	public accountSchema = accountSchema;

	public async beforeBlockApply(_input: BeforeBlockApplyContext) {
		//
	}

	public async afterBlockApply(_input: AfterBlockApplyContext) {
		//
	}

	public async beforeTransactionApply(_input: TransactionApplyContext) {
		//
	}

	public async afterTransactionApply({ transaction, stateStore }: TransactionApplyContext) {
		if (transaction.moduleID === this.id && transaction.assetID === 0) {
			const card = (await getStoreData(stateStore)).cards[0];
			this._channel.publish('lc:cardMinted', card);
		}

		if (transaction.moduleID === this.id && transaction.assetID === 2) {
			const transactionAsset: BuyAssetProps = codec.decode(buyAssetSchema, transaction.asset);
			const card = (await getStoreData(stateStore)).cards.find(c => c.id === transactionAsset.id);
			this._channel.publish('lc:cardSold', card);
		}
	}

	public async afterGenesisBlockApply(_input: AfterGenesisBlockApplyContext) {
		await _input.stateStore.chain.set(
			CHAIN_STATE_LC,
			codec.encode(lcListSchema, { cards: [] as LiskCard[], graveyard: [] as LiskCard[] }),
		);
	}
}
