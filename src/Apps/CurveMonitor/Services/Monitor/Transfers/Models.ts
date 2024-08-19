export interface Transaction {
  hash: string;
  nonce: bigint;
  blockHash: string;
  blockNumber: bigint;
  transactionIndex: bigint;
  from: string;
  to: string;
  value: bigint;
  gasPrice: bigint;
  gas: bigint;
  input: string;
  r: string;
  s: string;
  v: bigint;
  chainId?: bigint;
  type: bigint;
  maxFeePerGas?: bigint;
  maxPriorityFeePerGas?: bigint;
}

export interface BlockByNumber {
  number: number;
  hash: string;
  transactions: Transaction[];
}

export interface BlockInfo {
  hash: string;
  parentHash: string;
  sha3Uncles: string;
  miner: string;
  stateRoot: string;
  transactionsRoot: string;
  receiptsRoot: string;
  logsBloom: string;
  difficulty: bigint;
  number: bigint;
  gasLimit: bigint;
  gasUsed: bigint;
  timestamp: bigint;
  totalDifficulty: bigint;
  extraData: string;
  mixHash: string;
  nonce: bigint;
  baseFeePerGas: bigint;
  withdrawalsRoot: string;
  blobGasUsed: bigint;
  excessBlobGas: bigint;
  parentBeaconBlockRoot: string;
  uncles: string[];
  transactions: string[];
  size: bigint;
  withdrawals: Withdrawal[];
}

export interface Withdrawal {
  index: bigint;
  validatorIndex: bigint;
  address: string;
  amount: bigint;
}

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

export type GeneralSwapAddressSpecificBlockSummary = {
  blockNumber: number;
  blockUnixtime: number;
  swaps: Swap[][];
};

export type RawTransferEvent = {
  contractAddress: string;
  eventName: string;
  [key: string]: string;
};

export type TokenData = {
  address: string;
  symbol: string;
  decimals: number;
};

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

export type AggregatedBlockInfo = {
  txHash: string;
  receipt: Receipt | null;
  rawErc20Transfers: (RawTransferEvent | null | undefined)[] | null;
  cleanedTransfers: CleanedTransfer[] | null;
  swaps: Swap[] | null;
};

interface LogEntry {
  address: string;
  topics: string[];
  data: string;
  blockHash: string;
  blockNumber: bigint;
  transactionHash: string;
  transactionIndex: bigint;
  logIndex: bigint;
  removed: boolean;
}

export interface Receipt {
  status: bigint;
  cumulativeGasUsed: bigint;
  logs: LogEntry[];
  logsBloom: string;
  type: bigint;
  transactionHash: string;
  transactionIndex: bigint;
  blockHash: string;
  blockNumber: bigint;
  gasUsed: bigint;
  effectiveGasPrice: bigint;
  from: string;
  to: string;
}

interface Action {
  callType: string;
  from: string;
  gas: string;
  input: string;
  to: string;
  value: string;
}

interface Result {
  gasUsed: string;
  output: string;
}

export interface EthTransfer {
  sender: string;
  receiver: string;
  value: number; // Value in Ether as a floating-point number
}

export interface TransactionTrace {
  action: Action;
  blockHash: string;
  blockNumber: number;
  result: Result;
  subtraces: number;
  traceAddress: number[];
  transactionHash: string;
  type: string;
}
