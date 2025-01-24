import { toUTC } from "../timestamp";
import type * as Responses from "./responses";
import type * as Models from "./models";

export const parseMarket = (
  x: Responses.GetMarketsResponse["data"][number]
): Models.Market => ({
  name: x.name,
  controller: x.controller,
  vault: x.vault,
  llamma: x.llamma,
  policy: x.policy,
  oracle: x.oracle,
  rate: parseFloat(x.rate),
  apyBorrow: parseFloat(x.borrow_apy),
  apyLend: parseFloat(x.lend_apy),
  nLoans: x.n_loans,
  priceOracle: parseFloat(x.price_oracle),
  ammPrice: parseFloat(x.amm_price),
  totalDebt: parseFloat(x.total_debt),
  totalAssets: parseFloat(x.total_assets),
  totalDebtUsd: parseFloat(x.total_debt_usd),
  totalAssetsUsd: parseFloat(x.total_assets_usd),
  minted: parseFloat(x.minted),
  redeemed: parseFloat(x.redeemed),
  mintedUsd: parseFloat(x.minted_usd),
  redeemedUsd: parseFloat(x.redeemed_usd),
  collateralBalance: parseFloat(x.collateral_balance),
  borrowedBalance: parseFloat(x.borrowed_balance),
  collateralBalanceUsd: parseFloat(x.collateral_balance_usd),
  borrowedBalanceUsd: parseFloat(x.borrowed_balance_usd),
  tokenCollateral: {
    symbol: x.collateral_token.symbol,
    address: x.collateral_token.address,
  },
  tokenBorrowed: {
    symbol: x.borrowed_token.symbol,
    address: x.borrowed_token.address,
  },
});

export const parseSnapshot = (
  x: Responses.GetSnapshotsResponse["data"][number]
): Models.Snapshot => ({
  rate: parseFloat(x.rate),
  borrowApy: parseFloat(x.borrow_apy) / 100,
  lendApy: parseFloat(x.lend_apy) / 100,
  numLoans: x.n_loans,
  priceOracle: parseFloat(x.price_oracle),
  ammPrice: parseFloat(x.amm_price),
  totalDebt: parseFloat(x.total_debt),
  totalDebtUsd: parseFloat(x.total_debt_usd),
  totalAssets: parseFloat(x.total_assets),
  totalAssetsUsd: parseFloat(x.total_assets_usd),
  minted: parseFloat(x.minted),
  redeemed: parseFloat(x.redeemed),
  collateralBalance: parseFloat(x.collateral_balance),
  collateralBalanceUsd: parseFloat(x.collateral_balance_usd),
  borrowedBalance: parseFloat(x.borrowed_balance),
  borrowedBalanceUsd: parseFloat(x.borrowed_balance_usd),
  timestamp: toUTC(x.timestamp),
  discountLiquidation: x.liquidation_discount,
  discountLoan: x.loan_discount,
});

export const parseUserMarkets = (
  x: Responses.GetUserMarketsResponse
): Models.UserMarkets =>
  x.markets.map((market) => ({
    name: market.market_name,
    controller: market.controller,
    snapshotFirst: toUTC(market.first_snapshot),
    snapshotLast: toUTC(market.last_snapshot),
  }));

export const parseUserMarketStats = (
  x: Responses.GetUserMarketStatsResponse
) => ({
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
});

export const parseUserMarketSnapshots = (
  x: Responses.GetUserMarketSnapshotsResponse
): Models.UserMarketSnapshots => x.data.map(parseUserMarketStats);

export const parseUserCollateralEvents = (
  x: Responses.GetUserCollateralEventsResponse
): Models.UserCollateralEvents => ({
  controller: x.controller,
  user: x.user,
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
    user: y.user,
    collateralChange: y.collateral_change,
    collateralChangeUsd: y.collateral_change_usd ?? undefined,
    loanChange: y.loan_change,
    loanChangeUsd: y.loan_change_usd ?? undefined,
    liquidation:
      y.liquidation === null
        ? undefined
        : {
            user: y.liquidation.user,
            liquidator: y.liquidation.liquidator,
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
            user: y.leverage.user,
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
});
