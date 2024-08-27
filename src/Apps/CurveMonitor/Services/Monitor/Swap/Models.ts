export type Swap = {
  addressThatSwapped: string;
  senderAddress: string;
  coinBeforeSymbol: string;
  parsedBeforeAmount: number;
  coinBeforeAddress: string;
  receiverAddress: string;
  coinAfterSymbol: string;
  parsedAfterAmount: number;
  coinAfterAddress: string;
  txHash: string;
  blockNumber: number;
  blockUnixtime: number;
  positionInBlock: number;
  gasInGwei: number;
};

export type GeneralSwapAddressSpecificBlockSummary = {
  blockNumber: number;
  blockUnixtime: number;
  swaps: Swap[][];
};
