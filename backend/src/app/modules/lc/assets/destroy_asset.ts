import {
	BaseAsset,
	ApplyAssetContext,
	ValidateAssetContext,
	codec,
	transactions,
	cryptography,
	validator,
} from 'lisk-sdk';
import { LCAccountProps, DestroyAssetProps } from '../../../types';
import { FEES } from '../../../constants';
import { CHAIN_STATE_LC, lcListSchema, destroyAssetSchema } from '../schemas';
import { getStoreData } from '../../../utils/store';

export class DestroyAsset extends BaseAsset {
	public name = 'destroy';
	public id = 3;

	// Define schema for asset
	public schema = destroyAssetSchema;

	public validate({ asset }: ValidateAssetContext<DestroyAssetProps>): void {
		if (!validator.isHexString(asset.id)) {
			throw new Error(`Invalid id defined on transaction.`);
		}
	}

	// eslint-disable-next-line @typescript-eslint/require-await
	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<DestroyAssetProps>): Promise<void> {
		const minFee = BigInt(transactions.convertLSKToBeddows(FEES.DESTROY));
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

		storeData.cards = storeData.cards.filter(c => c.id !== asset.id);
		sender.lc.cards = sender.lc.cards.filter(c => c.id !== asset.id);
		storeData.graveyard.unshift(card);

		await stateStore.account.set(sender.address, sender);
		await stateStore.chain.set(CHAIN_STATE_LC, codec.encode(lcListSchema, storeData));
	}
}
