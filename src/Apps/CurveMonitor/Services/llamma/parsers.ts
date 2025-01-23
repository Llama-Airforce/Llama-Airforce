import type * as Responses from "./responses";
import type * as Models from "./models";

export const parseEvents = (
  x: Responses.GetLlammaEventsResponse["data"][number]
): Models.LlammaEvent => {
  const provider = x.provider.toLocaleLowerCase();
  const deposit = x.deposit
    ? {
        amount: x.deposit.amount,
        n1: x.deposit.n1,
        n2: x.deposit.n2,
      }
    : null;

  const withdrawal = x.withdrawal
    ? {
        amount_borrowed: x.withdrawal.amount_borrowed,
        amount_collateral: x.withdrawal.amount_collateral,
      }
    : null;

  const block_number = x.block_number;
  const timestamp = x.timestamp;
  const transaction_hash = x.transaction_hash.toLocaleLowerCase();

  return {
    provider,
    deposit,
    withdrawal,
    block_number,
    timestamp,
    transaction_hash,
  };
};

export const parseTrades = (
  x: Responses.GetLlammaTradesResponse["data"][number]
): Models.LlammaTrade => {
  return {
    sold_id: x.sold_id,
    bought_id: x.bought_id,
    token_sold: {
      symbol: x.token_sold.symbol,
      address: x.token_sold.address.toLocaleLowerCase(),
    },
    token_bought: {
      symbol: x.token_bought.symbol,
      address: x.token_bought.address.toLocaleLowerCase(),
    },
    amount_sold: x.amount_sold,
    amount_bought: x.amount_bought,
    price: x.price,
    buyer: x.buyer.toLocaleLowerCase(),
    fee_x: x.fee_x,
    fee_y: x.fee_y,
    block_number: x.block_number,
    timestamp: x.timestamp,
    transaction_hash: x.transaction_hash,
  };
};

export const parseOHLC = (
  x: Responses.GetLlammaOHLCResponse["data"][number]
): Models.LlammaOHLC => {
  return {
    time: x.time,
    open: x.open,
    close: x.close,
    high: x.high,
    low: x.low,
    base_price: x.base_price,
    oracle_price: x.oracle_price,
    volume: x.volume,
  };
};
