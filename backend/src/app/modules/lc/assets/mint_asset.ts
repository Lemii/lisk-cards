import { BaseAsset, ApplyAssetContext, codec, transactions, cryptography } from 'lisk-sdk';
import { mintRandomCard } from '../../../utils/generator';
import { LCAccountProps, MintAssetProps } from '../../../types';
import { FEES } from '../../../constants';
import { CHAIN_STATE_LC, lcListSchema, mintAssetSchema } from '../schemas';
import { getStoreData } from '../../../utils/store';

export class MintAsset extends BaseAsset {
	public name = 'mint';
	public id = 0;
	public schema = mintAssetSchema;

	public validate(): void {
		// Validate your asset
	}

	public async apply({
		transaction,
		stateStore,
	}: ApplyAssetContext<MintAssetProps>): Promise<void> {
		const minFee = BigInt(transactions.convertLSKToBeddows(FEES.MINT));
		if (transaction.fee < minFee) {
			throw new Error(
				`Invalid fee defined on transaction.\nReceived:  ${transaction.fee}\nExpected: ${minFee}`,
			);
		}

		const sender = await stateStore.account.get<LCAccountProps>(transaction.senderAddress);
		const senderBase32Address = cryptography.getBase32AddressFromAddress(sender.address);
		const card = mintRandomCard(senderBase32Address, transaction.id.toString('hex'));

		sender.lc.cards.unshift({ id: card.id, code: card.code });
		await stateStore.account.set(sender.address, sender);

		const storeData = await getStoreData(stateStore);

		storeData.cards.unshift(card);
		await stateStore.chain.set(CHAIN_STATE_LC, codec.encode(lcListSchema, storeData));
	}
}
