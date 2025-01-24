import type * as Responses from "./responses";
import type * as Models from "./models";

export const parseEvents = (
  x: Responses.GetLlammaEventsResponse["data"][number]
): Models.LlammaEvent => ({
  provider: x.provider.toLocaleLowerCase(),
  deposit: x.deposit
    ? {
        amount: x.deposit.amount,
        n1: x.deposit.n1,
        n2: x.deposit.n2,
      }
    : null,
  withdrawal: x.withdrawal
    ? {
        amount_borrowed: x.withdrawal.amount_borrowed,
        amount_collateral: x.withdrawal.amount_collateral,
      }
    : null,
  block_number: x.block_number,
  timestamp: x.timestamp,
  transaction_hash: x.transaction_hash.toLocaleLowerCase(),
});

export const parseTrades = (
  x: Responses.GetLlammaTradesResponse["data"][number]
): Models.LlammaTrade => ({
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
});

export const parseOHLC = (
  x: Responses.GetLlammaOHLCResponse["data"][number]
): Models.LlammaOHLC => ({
  time: x.time,
  open: x.open,
  close: x.close,
  high: x.high,
  low: x.low,
  base_price: x.base_price,
  oracle_price: x.oracle_price,
  volume: x.volume,
});
