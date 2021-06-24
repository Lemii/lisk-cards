import {
	BaseAsset,
	ApplyAssetContext,
	ValidateAssetContext,
	codec,
	transactions,
	cryptography,
	validator,
} from 'lisk-sdk';
import { LCAccountProps, BuyAssetProps } from '../../../types';
import { FEES } from '../../../constants';
import { CHAIN_STATE_LC, lcListSchema, buyAssetSchema } from '../schemas';
import { getStoreData } from '../../../utils/store';

export class BuyAsset extends BaseAsset {
	public name = 'buy';
	public id = 2;
	public schema = buyAssetSchema;

	public validate({ asset }: ValidateAssetContext<BuyAssetProps>): void {
		if (!validator.isHexString(asset.id)) {
			throw new Error(`Invalid id defined on transaction.`);
		}
	}

	public async apply({
		asset,
		transaction,
		stateStore,
		reducerHandler,
	}: ApplyAssetContext<BuyAssetProps>): Promise<void> {
		const minFee = BigInt(transactions.convertLSKToBeddows(FEES.BUY));
		if (transaction.fee < minFee) {
			throw new Error(
				`Invalid fee defined on transaction.\nReceived:  ${transaction.fee}\nExpected: ${minFee}`,
			);
		}

		const storeData = await getStoreData(stateStore);
		const card = storeData.cards.find(c => c.id === asset.id);

		if (!card) {
			throw new Error(`Card with id ${asset.id} does not exist.`);
		}

		if (!card.forSale) {
			throw new Error(`Card with id ${asset.id} is not for sale.`);
		}

		const sender = await stateStore.account.getOrDefault<LCAccountProps>(transaction.senderAddress);
		const senderBalance: bigint = await reducerHandler.invoke('token:getBalance', {
			address: sender.address,
		});
		const senderBase32Address = cryptography.getBase32AddressFromAddress(sender.address);
		const seller = await stateStore.account.get<LCAccountProps>(
			cryptography.getAddressFromBase32Address(card.owner),
		);

		if (card.owner === senderBase32Address) {
			throw new Error(`Sender is already owner of Lisk Card.`);
		}

		const assetPrice = BigInt(transactions.convertLSKToBeddows(card.price.toString()));
		if (assetPrice + minFee > senderBalance) {
			throw new Error(
				`Sender has insufficient balance.\nReceived:  ${senderBalance}\nExpected: ${
					assetPrice + minFee
				}`,
			);
		}

		card.owner = senderBase32Address;
		card.timesSold += 1;
		card.forSale = false;

		sender.lc.cards.unshift({ id: card.id, code: card.code });
		seller.lc.cards = seller.lc.cards.filter(c => c.id !== card.id);

		await reducerHandler.invoke('token:debit', {
			address: sender.address,
			amount: assetPrice,
		});

		await reducerHandler.invoke('token:credit', {
			address: seller.address,
			amount: assetPrice,
		});

		await stateStore.account.set(sender.address, sender);
		await stateStore.account.set(seller.address, seller);
		await stateStore.chain.set(CHAIN_STATE_LC, codec.encode(lcListSchema, storeData));
	}
}
