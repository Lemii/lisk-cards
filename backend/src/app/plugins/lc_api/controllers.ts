import { BaseChannel } from 'lisk-sdk';
import { LcStore } from '../../types';

export const getAllCards = async (channel: BaseChannel) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return state.cards;
};

export const getGraveyard = async (channel: BaseChannel) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return state.graveyard;
};

export const getCardById = async (channel: BaseChannel, id: string | undefined) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return state.cards.find(card => card.id === id);
};

export const getCardsByOwner = async (channel: BaseChannel, owner: string | undefined) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return owner ? state.cards.filter(card => card.owner === owner) : state.cards;
};

export const getCardsOfType = async (channel: BaseChannel, code: string | undefined) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return code ? state.cards.filter(card => card.code === code) : state.cards;
};

export const getCardsOnSale = async (channel: BaseChannel) => {
	const state = await channel.invoke<LcStore>('lc:getState');
	return state.cards.filter(card => card.forSale);
};
