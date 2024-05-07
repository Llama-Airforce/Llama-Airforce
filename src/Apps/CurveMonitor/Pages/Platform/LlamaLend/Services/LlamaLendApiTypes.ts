import { type Chain } from "@CM/Models/Chain";

export type GetChainsResponse = {
  data: Chain[];
};

export type GetMarketsResponse = {
  data: [
    {
      name: string;
      controller: string;
      vault: string;
      llamma: string;
      policy: string;
      oracle: string;
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
      collateral_token: {
        symbol: string;
        address: string;
      };
      borrowed_token: {
        symbol: string;
        address: string;
      };
    }
  ];
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
    }
  ];
};

export type GetSoftLiqRatiosResponse = {
  data: {
    timestamp: string;
    proportion: string;
  }[];
};

export type GetLiqHistoryResponse = {
  data: {
    timestamp: string;
    self_count: number;
    hard_count: number;
    self_value: number;
    hard_value: number;
    price: number;
  }[];
};
