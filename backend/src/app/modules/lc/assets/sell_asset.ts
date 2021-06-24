import {
	BaseAsset,
	ApplyAssetContext,
	ValidateAssetContext,
	codec,
	transactions,
	cryptography,
	validator,
} from 'lisk-sdk';
import { LCAccountProps, SellAssetProps } from '../../../types';
import { FEES } from '../../../constants';
import { CHAIN_STATE_LC, lcListSchema, sellAssetSchema } from '../schemas';
import { getStoreData } from '../../../utils/store';

export class SellAsset extends BaseAsset {
	public name = 'sell';
	public id = 1;
	public schema = sellAssetSchema;

	public validate({ asset }: ValidateAssetContext<SellAssetProps>): void {
		if (asset.price <= 0) {
			throw new Error(
				`Invalid price defined on transaction.\nReceived: ${asset.price}\nExpected: > 0`,
			);
		}

		if (!validator.isHexString(asset.id)) {
			console.error(asset.id);
			throw new Error(`Invalid id defined on transaction.`);
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<SellAssetProps>): Promise<void> {
		const minFee = BigInt(transactions.convertLSKToBeddows(FEES.SELL));
		if (transaction.fee < minFee) {
			throw new Error(
				`Invalid fee defined on transaction.\nReceived:  ${transaction.fee}\nExpected: ${minFee}`,
			);
		}

		const sender = await stateStore.account.get<LCAccountProps>(transaction.senderAddress);
		const senderBase32Address = cryptography.getBase32AddressFromAddress(sender.address);
		const storeData = await getStoreData(stateStore);

		const card = storeData.cards.find(c => c.id === asset.id);

		if (!card) {
			throw new Error(`Card with id ${asset.id} does not exist.`);
		}

		if (card.owner !== senderBase32Address) {
			throw new Error(`Sender is not owner of Lisk Card.`);
		}

		card.forSale = true;
		card.price = asset.price;

		await stateStore.chain.set(CHAIN_STATE_LC, codec.encode(lcListSchema, storeData));
	}
}
