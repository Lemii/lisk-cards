import { Credentials } from "../types";

const credentialKey = "liskcard_credentials";
const lastTxKey = "liskcard_last_tx";

export const saveCredentialsToStorage = (credentials: Credentials) => {
  const data = JSON.stringify(credentials);
  localStorage.setItem(credentialKey, data);
};

export const getCredentialsFromStorage = () => {
  const data = localStorage.getItem(credentialKey);
  return data ? JSON.parse(data) : null;
};

export const removeCredentialsFromStorage = () => {
  localStorage.removeItem(credentialKey);
};

export const setLastTransactionTimestamp = (timestamp: number) => {
  localStorage.setItem(lastTxKey, timestamp.toString());
};

export const getLastTransactionTimestamp = () => {
  const data = localStorage.getItem(lastTxKey);
  return data ? Number(data) : 0;
};
