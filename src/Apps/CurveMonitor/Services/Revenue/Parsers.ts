import { toUTC } from "@CM/Services";
import type * as ApiTypes from "@CM/Services/Revenue/ApiTypes";
import type * as Models from "@CM/Services/Revenue/Models";

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
  x: ApiTypes.GetCushionsResponse["data"][number]
): Models.Cushion => {
  return {
    pool: x.pool.toLocaleLowerCase() as Address,
    name: x.name,
    adminFees: x.admin_fees,
    usdValue: x.usd_value,
  };
};

export const parseDistribution = (
  x: ApiTypes.GetDistributionsResponse["distributions"][number]
): Models.Distribution => {
  return {
    timestamp: toUTC(x.timestamp),
    feesUsd: x.fees_usd,
  };
};
