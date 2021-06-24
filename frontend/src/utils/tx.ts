import * as api from "./api";
import * as transactions from "@liskhq/lisk-transactions";
import {
  getLastTransactionTimestamp,
  setLastTransactionTimestamp,
} from "./storage";
import { cryptography } from "@liskhq/lisk-client";

const canSendTx = () => {
  const currentTs = Date.now();
  const lastTx = getLastTransactionTimestamp();

  return currentTs - lastTx > 10000;
};

const errorMessage =
  "Please wait 10 seconds before sending another transaction..";

export const mintCard = async (passphrase: string) => {
  if (!canSendTx()) {
    throw Error(errorMessage);
  }

  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 0,
      fee: BigInt(transactions.convertLSKToBeddows("100")),
      asset: {
        message: "",
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};

export const sellCard = async (
  id: string,
  price: number,
  passphrase: string
) => {
  if (!canSendTx()) {
    throw Error(errorMessage);
  }

  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 1,
      fee: BigInt(transactions.convertLSKToBeddows("1")),
      asset: {
        id,
        price,
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};

export const buyCard = async (id: string, passphrase: string) => {
  if (!canSendTx()) {
    throw Error(errorMessage);
  }

  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 2,
      fee: BigInt(transactions.convertLSKToBeddows("1")),
      asset: {
        id,
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};

export const destroyCard = async (id: string, passphrase: string) => {
  if (!canSendTx()) {
    throw Error(errorMessage);
  }

  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 3,
      fee: BigInt(transactions.convertLSKToBeddows("5")),
      asset: {
        id,
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};

export const cancelCard = async (id: string, passphrase: string) => {
  if (!canSendTx()) {
    throw Error(errorMessage);
  }

  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleID: 1000,
      assetID: 4,
      fee: BigInt(transactions.convertLSKToBeddows("2")),
      asset: {
        id,
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};

export const fundAccount = async (address: string) => {
  const passphrase = process.env.REACT_APP_SEED_PASSPHRASE!;
  const client = await api.getClient();

  const tx = await client.transaction.create(
    {
      moduleName: "token",
      assetName: "transfer",
      fee: BigInt(transactions.convertLSKToBeddows("1")),

      asset: {
        recipientAddress: cryptography.getAddressFromLisk32Address(address),
        amount: BigInt(100000000000),
        data: "Faucet transaction",
      },
    },
    passphrase
  );

  return client.transaction.send(tx).then(() => {
    setLastTransactionTimestamp(Date.now());
  });
};
