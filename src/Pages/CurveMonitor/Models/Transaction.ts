export type TransactionType = "swap" | "deposit" | "withdraw";

export type Transaction = {
  type: TransactionType;
  txHash: Lowercase<string>;
  blockNumber: number;
  trader: Lowercase<string>;
  timestamp: number;
  value: number;
};

type TransactionIn = {
  tokenIn: string;
  amountIn: number;
};

type TransactionOut = {
  tokenOut: string;
  amountOut: number;
};

export type Swap = Transaction &
  TransactionIn &
  TransactionOut & {
    type: "swap";
    fee: number;
  };

export type Deposit = Transaction &
  TransactionIn & {
    type: "deposit";
  };

export type Withdraw = Transaction &
  TransactionOut & {
    type: "withdraw";
  };

export function isSwap(tx: Transaction): tx is Swap {
  return tx.type === "swap";
}

export function isDeposit(tx: Transaction): tx is Deposit {
  return tx.type === "deposit";
}

export function isWithdraw(tx: Transaction): tx is Withdraw {
  return tx.type === "withdraw";
}
