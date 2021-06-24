import { apiClient, cryptography } from "@liskhq/lisk-client";
import { Account, LiskCard, Statistics } from "../types";

const RPC_ENDPOINT = process.env.REACT_APP_NODE;

let clientCache: apiClient.APIClient;

export const getClient = async () => {
  if (!RPC_ENDPOINT) {
    throw new Error("No RPC endpoint defined");
  }
  if (!clientCache) {
    clientCache = await apiClient.createWSClient(RPC_ENDPOINT);
  }
  return clientCache;
};

export const getAccount = async (address: string): Promise<Account | null> => {
  // get account details based on Lisk (lsk) address
  const client = await getClient();
  const account = await client.account.get(
    cryptography.getAddressFromBase32Address(address)
  );
  // @ts-ignore
  return account || null;
};

export const subscribeToMintCard = async (handler: Function) => {
  const client = await getClient();
  client.subscribe("lc:cardMinted", (e) => handler(e));
};

export const getAllCards = async () => {
  const client = await getClient();
  return client.invoke<LiskCard[]>("lcApi:getAllCards");
};

export const getNewestCard = async () => {
  const client = await getClient();
  return client.invoke<LiskCard>("lcApi:lcApi:getNewestCard");
};

export const getCardById = async (id: string) => {
  const client = await getClient();
  return client.invoke<LiskCard>("lcApi:getCardById", { id });
};

export const getCardsOnSale = async () => {
  const client = await getClient();
  return client.invoke<LiskCard[]>("lcApi:getCardsOnSale");
};

export const getStatistics = async () => {
  const client = await getClient();
  return client.invoke<Statistics>("lcApi:getStatistics");
};

export const getGraveyard = async () => {
  const client = await getClient();
  return client.invoke<LiskCard[]>("lcApi:getGraveyard");
};
