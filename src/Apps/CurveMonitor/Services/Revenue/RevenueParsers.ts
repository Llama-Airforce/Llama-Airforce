import type * as ApiTypes from "@CM/Services/Revenue/RevenueApiTypes";
import type * as Models from "@CM/Services/Revenue/RevenueModels";

export const parseBreakdown = (
  x: ApiTypes.GetBreakdownResponse["revenue"][number]
): Models.BreakdownRevenue => {
  return {
    week: x.week,
    label: x.label,
    total_fees: x.total_fees,
  };
};

export const parseChainRevenue = (
  x: ApiTypes.GetByChainResponse["revenue"][number]
): Models.ChainRevenue => {
  return {
    chain: x.chain,
    totalDailyFeesUSD: x.totalDailyFeesUSD,
  };
};

export const parseTopPools = (
  x: ApiTypes.GetTopPoolsResponse["revenue"][number]
): Models.ChainTopPoolRevenue => {
  return {
    name: x.name,
    totalDailyFeesUSD: x.totalDailyFeesUSD,
  };
};

export const parseCushion = (
  x: ApiTypes.GetCushionsResponse["cushions"][number]
): Models.Cushion => {
  return {
    pool: x.pool,
    address: x.address.toLowerCase(),
    chain: x.chain,
    coins: x.coins.map((y) => y.toLocaleLowerCase()),
    coinNames: x.coinNames,
    balance: x.balance,
    value: x.value,
    totalUSD: x.totalUSD,
  };
};
