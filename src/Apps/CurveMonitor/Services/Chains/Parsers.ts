import { type Chain, chains } from "@/Types/Chain";
import { toUTC } from "@CM/Services";
import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parseSupportedChains = (
  x: ApiTypes.GetSupportedChainsResponse
): Chain[] => {
  return x.data.map((y) => y.name as Chain).filter((y) => chains.includes(y));
};

export const parseChainInfo = (
  x: ApiTypes.GetChainInfoResponse
): Models.ChainInfo => {
  return {
    chain: x.chain,
    total: {
      tvl: x.total.total_tvl,
      tradingVolume24h: x.total.trading_volume_24h,
      tradingFee24h: x.total.trading_fee_24h,
      liquidityVolume24h: x.total.liquidity_volume_24h,
      liquidityFee24h: x.total.liquidity_fee_24h,
    },
  };
};

export const parseTxs = (
  x: ApiTypes.GetTransactionsResponse
): Models.Transactions[] => {
  return x.data.flatMap((data) =>
    data.transactions.map((tx) => ({
      chain: data.chain,
      timestamp: toUTC(tx.timestamp),
      type: tx.type,
      transactions: tx.transactions,
    }))
  );
};

export const parseUsers = (x: ApiTypes.GetUsersResponse): Models.Users[] => {
  return x.data.flatMap((data) =>
    data.users.map((tx) => ({
      chain: data.chain,
      timestamp: toUTC(tx.timestamp),
      type: tx.type,
      users: tx.users,
    }))
  );
};
