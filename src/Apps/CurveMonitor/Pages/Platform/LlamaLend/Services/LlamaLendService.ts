import { ServiceBase } from "@/Services";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

const API_URL = "https://prices.curve.fi";

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

const parseMarket = (x: GetMarketsResponse["data"][number]): Market => {
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

export default class LlamaLendService extends ServiceBase {
  public async getMarkets(): Promise<Market[]> {
    const resp = await this.fetch<GetMarketsResponse>(
      `${API_URL}/v1/lending/markets/ethereum?page=1&per_page=100`
    );

    return resp.data.map(parseMarket);
  }
}
