import {
	BaseAsset,
	ApplyAssetContext,
	ValidateAssetContext,
	codec,
	transactions,
	cryptography,
	validator,
} from 'lisk-sdk';
import { LCAccountProps, CancelAssetProps } from '../../../types';
import { FEES } from '../../../constants';
import { CHAIN_STATE_LC, lcListSchema, cancelAssetSchema } from '../schemas';
import { getStoreData } from '../../../utils/store';

export class CancelAsset extends BaseAsset {
	public name = 'cancel';
	public id = 4;

	public schema = cancelAssetSchema;

	public validate({ asset }: ValidateAssetContext<CancelAssetProps>): void {
		if (!validator.isHexString(asset.id)) {
			throw new Error(`Invalid id defined on transaction.`);
		}
	}

	public async apply({
		asset,
		transaction,
		stateStore,
	}: ApplyAssetContext<CancelAssetProps>): Promise<void> {
		const minFee = BigInt(transactions.convertLSKToBeddows(FEES.CANCEL));
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

		card.forSale = false;

		await stateStore.chain.set(CHAIN_STATE_LC, codec.encode(lcListSchema, storeData));
	}
}
