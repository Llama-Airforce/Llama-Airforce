import { toUTC } from "../";
import type * as ApiTypes from "./apiTypes";
import type * as Models from "./models";

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

export const parseUserMarkets = (
  x: ApiTypes.GetUserMarketsResponse
): Models.UserMarkets => {
  return x.markets.map((market) => ({
    name: market.market_name,
    controller: market.controller,
    snapshotFirst: toUTC(market.first_snapshot),
    snapshotLast: toUTC(market.last_snapshot),
  }));
};

export const parseUserMarketStats = (
  x: ApiTypes.GetUserMarketStatsResponse
) => {
  return {
    health: x.health,
    healthFull: x.health_full,
    n: x.n,
    n1: x.n1,
    n2: x.n2,
    debt: x.debt,
    collateral: x.collateral,
    collateralUp: x.collateral_up,
    borrowed: x.borrowed,
    softLiquidation: x.soft_liquidation,
    totalDeposited: x.total_deposited,
    loss: x.loss,
    lossPct: x.loss_pct,
    oraclePrice: x.oracle_price,
    blockNumber: x.block_number,
    timestamp: toUTC(x.timestamp),
  };
};

export const parseUserMarketSnapshots = (
  x: ApiTypes.GetUserMarketSnapshotsResponse
): Models.UserMarketSnapshots => {
  return x.data.map(parseUserMarketStats);
};

export const parseUserCollateralEvents = (
  x: ApiTypes.GetUserCollateralEventsResponse
): Models.UserCollateralEvents => {
  return {
    controller: x.controller.toLocaleLowerCase(),
    user: x.user.toLocaleLowerCase(),
    totalDeposit: x.total_deposit,
    totalDepositUsd: x.total_deposit_usd_value,
    totalDepositFromUser: x.total_deposit_from_user,
    totalDepositFromUserPrecise: x.total_deposit_from_user_precise,
    totalDepositPrecise: x.total_deposit_precise,
    totalBorrowed: x.total_borrowed,
    totalBorrowedPrecise: x.total_borrowed_precise,
    events: x.data.map((y) => ({
      timestamp: toUTC(y.dt),
      txHash: y.transaction_hash,
      type: y.type,
      user: y.user.toLocaleLowerCase(),
      collateralChange: y.collateral_change,
      collateralChangeUsd: y.collateral_change_usd ?? undefined,
      loanChange: y.loan_change,
      loanChangeUsd: y.loan_change_usd ?? undefined,
      liquidation:
        y.liquidation === null
          ? undefined
          : {
              user: y.liquidation.user.toLocaleLowerCase(),
              liquidator: y.liquidation.liquidator.toLocaleLowerCase(),
              collateralReceived: y.liquidation.collateral_received,
              collateralReceivedUsd: y.liquidation.collateral_received_usd,
              stablecoinReceived: y.liquidation.stablecoin_received,
              stablecoinReceivedUsd: y.liquidation.stablecoin_received_usd,
              debt: y.liquidation.debt,
              debtUsd: y.liquidation.debt_usd,
            },
      leverage:
        y.leverage === null
          ? undefined
          : {
              type: y.leverage.event_type,
              user: y.leverage.user.toLocaleLowerCase(),
              userCollateral: y.leverage.user_collateral,
              userCollateralFromBorrowed:
                y.leverage.user_collateral_from_borrowed,
              userCollateralUsed: y.leverage.user_collateral_used,
              userBorrowed: y.leverage.user_borrowed,
              debt: y.leverage.debt,
              leverageCollateral: y.leverage.leverage_collateral,
              stateCollateralUsed: y.leverage.state_collateral_used,
              borrowedFromStateCollateral:
                y.leverage.borrowed_from_state_collateral,
              borrowedFromUserCollateral:
                y.leverage.borrowed_from_user_collateral,
            },
      n1: y.n1,
      n2: y.n2,
      oraclePrice: y.oracle_price,
    })),
  };
};
