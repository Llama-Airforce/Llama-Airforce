import type * as ApiTypes from "@CM/Pages/Platform/LlamaLend/Services/LlamaLendApiTypes";
import type * as Models from "@CM/Pages/Platform/LlamaLend/Models";

export const parseMarket = (
  x: ApiTypes.GetMarketsResponse["data"][number]
): Models.Market => {
  const name = x.name;
  const controller = x.controller;
  const numLoans = x.n_loans;
  const borrowRate = parseFloat(x.borrow_apy);
  const lendRate = parseFloat(x.lend_apy);
  const priceOracle = parseFloat(x.price_oracle);
  const totalAssets = parseFloat(x.total_assets);
  const collateralBalance = parseFloat(x.collateral_balance);

  return {
    name,
    controller,
    numLoans,
    borrowRate,
    lendRate,
    priceOracle,
    totalAssets,
    collateralBalance,
  };
};

export const parseSnapshot = (
  x: ApiTypes.GetSnapshotsResponse["data"][number]
): Models.Snapshot => {
  const rate = parseFloat(x.rate);
  const borrowApy = parseFloat(x.borrow_apy) / 100;
  const lendApy = parseFloat(x.lend_apy) / 100;
  const numLoans = x.n_loans;
  const priceOracle = parseFloat(x.price_oracle);
  const ammPrice = parseFloat(x.amm_price);
  const totalDebt = parseFloat(x.total_debt);
  const totalAssets = parseFloat(x.total_assets);
  const minted = parseFloat(x.minted);
  const redeemed = parseFloat(x.redeemed);
  const collateralBalance = parseFloat(x.collateral_balance);
  const borrowedBalance = parseFloat(x.borrowed_balance);
  const timestamp = new Date(x.timestamp).getTime() / 1000;

  return {
    rate,
    borrowApy,
    lendApy,
    numLoans,
    priceOracle,
    ammPrice,
    totalDebt,
    totalAssets,
    minted,
    redeemed,
    collateralBalance,
    borrowedBalance,
    timestamp,
  };
};

export const parseSoftLiqRatio = (
  x: ApiTypes.GetSoftLiqRatiosResponse["data"][number]
): Models.SoftLiqRatio => {
  return {
    timestamp: new Date(x.timestamp).getTime() / 1000,
    proportion: parseFloat(x.proportion.replace("%", "")) / 100,
  };
};

export const parseLiqHistory = (
  x: ApiTypes.GetLiqHistoryResponse["data"][number]
): Models.LiqHistory => {
  return {
    timestamp: new Date(x.timestamp).getTime() / 1000,
    self_count: x.self_count,
    hard_count: x.hard_count,
    self_value: x.self_value,
    hard_value: x.hard_value,
    price: x.price,
  };
};
