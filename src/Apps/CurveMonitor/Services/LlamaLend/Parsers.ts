import { toUTC } from "@CM/Services";
import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parseMarket = (
  x: ApiTypes.GetMarketsResponse["data"][number]
): Models.Market => {
  return {
    name: x.name,
    controller: x.controller.toLocaleLowerCase(),
    vault: x.vault.toLocaleLowerCase(),
    llamma: x.llamma.toLocaleLowerCase(),
    policy: x.policy.toLocaleLowerCase(),
    oracle: x.oracle.toLocaleLowerCase(),
    rate: parseFloat(x.rate),
    borrow_apy: parseFloat(x.borrow_apy),
    lend_apy: parseFloat(x.lend_apy),
    n_loans: x.n_loans,
    price_oracle: parseFloat(x.price_oracle),
    amm_price: parseFloat(x.amm_price),
    total_debt: parseFloat(x.total_debt),
    total_assets: parseFloat(x.total_assets),
    total_debt_usd: parseFloat(x.total_debt_usd),
    total_assets_usd: parseFloat(x.total_assets_usd),
    minted: parseFloat(x.minted),
    redeemed: parseFloat(x.redeemed),
    minted_usd: parseFloat(x.minted_usd),
    redeemed_usd: parseFloat(x.redeemed_usd),
    collateral_balance: parseFloat(x.collateral_balance),
    borrowed_balance: parseFloat(x.borrowed_balance),
    collateral_balance_usd: parseFloat(x.collateral_balance_usd),
    borrowed_balance_usd: parseFloat(x.borrowed_balance_usd),
    collateral_token: {
      symbol: x.collateral_token.symbol,
      address: x.collateral_token.address.toLocaleLowerCase(),
    },
    borrowed_token: {
      symbol: x.borrowed_token.symbol,
      address: x.borrowed_token.address.toLocaleLowerCase(),
    },
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
  const totalDebtUsd = parseFloat(x.total_debt_usd);
  const totalAssets = parseFloat(x.total_assets);
  const totalAssetsUsd = parseFloat(x.total_assets_usd);
  const minted = parseFloat(x.minted);
  const redeemed = parseFloat(x.redeemed);
  const collateralBalance = parseFloat(x.collateral_balance);
  const collateralBalanceUsd = parseFloat(x.collateral_balance_usd);
  const borrowedBalance = parseFloat(x.borrowed_balance);
  const borrowedBalanceUsd = parseFloat(x.borrowed_balance_usd);
  const timestamp = toUTC(x.timestamp);
  const discountLiquidation = x.liquidation_discount;
  const discountLoan = x.loan_discount;

  return {
    rate,
    borrowApy,
    lendApy,
    numLoans,
    priceOracle,
    ammPrice,
    totalDebt,
    totalDebtUsd,
    totalAssets,
    totalAssetsUsd,
    minted,
    redeemed,
    collateralBalance,
    collateralBalanceUsd,
    borrowedBalance,
    borrowedBalanceUsd,
    timestamp,
    discountLiquidation,
    discountLoan,
  };
};
