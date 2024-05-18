import type * as ApiTypes from "@CM/Services/LlamaLend/ApiTypes";
import type * as Models from "@CM/Services/LlamaLend/Models";

export const parseMarket = (
  x: ApiTypes.GetMarketsResponse["data"][number]
): Models.Market => {
  return {
    name: x.name,
    controller: x.controller,
    vault: x.vault,
    llamma: x.llamma,
    policy: x.policy,
    oracle: x.oracle,
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
      address: x.collateral_token.address,
    },
    borrowed_token: {
      symbol: x.borrowed_token.symbol,
      address: x.borrowed_token.address,
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
    proportion: x.proportion / 100,
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

export const parseLlammaEvents = (
  x: ApiTypes.GetLlammaEventsResponse["data"][number]
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

  const blockNumber = x.block_number;
  const timestamp = x.timestamp;
  const transactionHash = x.transaction_hash.toLocaleLowerCase();

  return {
    provider,
    deposit,
    withdrawal,
    block_number: blockNumber,
    timestamp,
    transaction_hash: transactionHash,
  };
};

export const parseLlammaTrades = (
  x: ApiTypes.GetLlammaTradesResponse["data"][number]
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
