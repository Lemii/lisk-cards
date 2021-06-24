export const CHAIN_STATE_LC = 'lc:state';

export const accountSchema = {
	$id: '/lc/lc-account',
	type: 'object',
	required: ['cards'],
	properties: {
		cards: {
			fieldNumber: 1,
			type: 'array',
			required: ['id', 'code'],
			items: {
				type: 'object',
				properties: {
					id: {
						dataType: 'string',
						fieldNumber: 1,
					},
					code: {
						dataType: 'string',
						fieldNumber: 2,
					},
				},
			},
		},
	},
	default: { cards: [] },
};

const liskCardSchema = {
	type: 'object',
	required: ['id', 'code', 'owner', 'forSale', 'price', 'timesSold', 'dateMinted'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		code: {
			dataType: 'string',
			fieldNumber: 2,
		},
		owner: {
			dataType: 'string',
			fieldNumber: 3,
		},
		forSale: {
			dataType: 'boolean',
			fieldNumber: 4,
		},
		price: {
			dataType: 'uint32',
			fieldNumber: 5,
		},
		timesSold: {
			dataType: 'uint32',
			fieldNumber: 6,
		},
		dateMinted: {
			dataType: 'string',
			fieldNumber: 7,
		},
	},
};

export const lcListSchema = {
	$id: '/lc/lc-list',
	type: 'object',
	required: ['cards', 'graveyard'],
	properties: {
		cards: {
			fieldNumber: 1,
			type: 'array',
			items: liskCardSchema,
		},
		graveyard: {
			fieldNumber: 2,
			type: 'array',
			items: liskCardSchema,
		},
	},
};

export const mintAssetSchema = {
	$id: 'lc/mint-asset',
	title: 'MintAsset transaction asset for lc module',
	type: 'object',
	required: [],
	properties: {
		message: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const sellAssetSchema = {
	$id: 'lc/sell-asset',
	title: 'SellAsset transaction asset for lc module',
	type: 'object',
	required: ['id', 'price'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
		price: {
			dataType: 'uint32',
			fieldNumber: 2,
		},
	},
};

export const buyAssetSchema = {
	$id: 'lc/buy-asset',
	title: 'BuyAsset transaction asset for lc module',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const destroyAssetSchema = {
	$id: 'lc/destroy-asset',
	title: 'DestroyAsset transaction asset for lc module',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};

export const cancelAssetSchema = {
	$id: 'lc/cancel-asset',
	title: 'CancelAsset transaction asset for lc module',
	type: 'object',
	required: ['id'],
	properties: {
		id: {
			dataType: 'string',
			fieldNumber: 1,
		},
	},
};
