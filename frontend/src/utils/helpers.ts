import { transactions } from "@liskhq/lisk-client";
import moment from "moment";

export const getDateFromTimestamp = (timestamp: number) => {
  return moment(timestamp).format("YYYY-MM-DD");
};

export const formatBalance = (balance: bigint) => {
  return transactions.convertBeddowsToLSK(balance.toString());
};

export const truncateMiddle = (input: string, maxLength?: number) => {
  if (!maxLength || input.length <= maxLength) {
    return input;
  }

  const separator = "...";

  const sepLen = separator.length,
    charsToShow = maxLength - sepLen,
    frontChars = Math.ceil(charsToShow / 2),
    backChars = Math.floor(charsToShow / 2);

  return (
    input.substr(0, frontChars) +
    separator +
    input.substr(input.length - backChars)
  );
};
