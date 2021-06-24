import { BasePlugin, PluginInfo } from 'lisk-sdk';
import type { BaseChannel, EventsDefinition, ActionsDefinition, SchemaWithDefault } from 'lisk-sdk';
import * as controllers from './controllers';
import { Statistics, UpdateType } from './types';
import { LiskCard } from '../../types';
import { loadData, saveData, updateStatistics } from './utils';

/* eslint-disable class-methods-use-this */
/* eslint-disable  @typescript-eslint/no-empty-function */
export class LcApiPlugin extends BasePlugin {
	private _channel!: BaseChannel;
	private _statistics!: Statistics;
	private _newestCard!: LiskCard | undefined;

	public static get alias(): string {
		return 'lcApi';
	}

	// eslint-disable-next-line @typescript-eslint/class-literal-property-style
	public static get info(): PluginInfo {
		return {
			author: 'lemii <info@lisktools.eu>',
			version: '0.1.0',
			name: 'lcApi',
		};
	}

	// eslint-disable-next-line @typescript-eslint/explicit-member-accessibility
	public get defaults(): SchemaWithDefault {
		return {
			$id: '/plugins/plugin-lcApi/config',
			type: 'object',
			properties: {},
			required: [],
			default: {},
		};
	}

	public get events(): EventsDefinition {
		return [
			// 'block:created',
			// 'block:missed'
		];
	}

	public get actions(): ActionsDefinition {
		return {
			getAllCards: async () => controllers.getAllCards(this._channel),
			getCardsOnSale: async () => controllers.getCardsOnSale(this._channel),
			getGraveyard: async () => controllers.getGraveyard(this._channel),
			getCardById: async params =>
				controllers.getCardById(this._channel, params?.id as string | undefined),
			getCardsByOwner: async params =>
				controllers.getCardsByOwner(this._channel, params?.owner as string | undefined),
			getCardsOfType: async params =>
				controllers.getCardsOfType(this._channel, params?.code as string | undefined),
			getNewestCard: () => this._newestCard,
			getStatistics: () => this._statistics,
		};
	}

	public async load(channel: BaseChannel): Promise<void> {
		const { card, statistics } = await loadData();

		this._newestCard = card;
		this._statistics = statistics;
		this._channel = channel;

		channel.subscribe('lc:cardMinted', mintedCard => {
			const data = mintedCard as LiskCard;
			this._newestCard = data;
			this._statistics = updateStatistics(this._statistics, data, UpdateType.mint);
		});

		channel.subscribe('lc:cardSold', soldCard => {
			const data = soldCard as LiskCard;
			this._logger.info({ data });
			this._statistics = updateStatistics(this._statistics, data, UpdateType.sold);
		});
	}

	public async unload(): Promise<void> {
		await saveData(this._newestCard, this._statistics);
	}
}
