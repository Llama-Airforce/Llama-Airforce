export type CleanedTransfer = {
  transferFrom: string;
  transferTo: string;
  parsedAmount: number;
  coinAddress: string;
  coinSymbol: string;
  txHash: string;
  blockNumber: number;
  blockUnixtime: number;
  positionInBlock: number;
  gasInGwei: number;
  contractCaller: string;
  calledContract: string;
};

export type GeneralErc20TokenSpecificBlockSummary = {
  blockNumber: number;
  blockUnixtime: number;
  transfers: CleanedTransfer[][];
};
