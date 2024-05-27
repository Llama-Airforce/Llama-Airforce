import { type Chain } from "@CM/Models/Chain";

export type GetChainsResponse = {
  data: Chain[];
};

export type GetMarketsResponse = {
  data: {
    name: string;
    controller: string;
    vault: string;
    llamma: string;
    policy: string;
    oracle: string;
    rate: string;
    borrow_apy: string;
    lend_apy: string;
    n_loans: 0;
    price_oracle: string;
    amm_price: string;
    total_debt: string;
    total_assets: string;
    total_debt_usd: string;
    total_assets_usd: string;
    minted: string;
    redeemed: string;
    minted_usd: string;
    redeemed_usd: string;
    collateral_balance: string;
    borrowed_balance: string;
    collateral_balance_usd: string;
    borrowed_balance_usd: string;
    collateral_token: {
      symbol: string;
      address: string;
    };
    borrowed_token: {
      symbol: string;
      address: string;
    };
  }[];
};

export type GetSnapshotsResponse = {
  data: [
    {
      rate: string;
      borrow_apy: string;
      lend_apy: string;
      n_loans: number;
      price_oracle: string;
      amm_price: string;
      total_debt: string;
      total_assets: string;
      minted: string;
      redeemed: string;
      collateral_balance: string;
      borrowed_balance: string;
      timestamp: string;
      liquidation_discount: number;
      loan_discount: number;
    }
  ];
};
