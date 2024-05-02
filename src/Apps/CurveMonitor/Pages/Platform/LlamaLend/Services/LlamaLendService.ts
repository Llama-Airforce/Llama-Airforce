import { ServiceBase } from "@/Services";
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";
import { type Snapshot } from "@CM/Pages/Platform/LlamaLend/Models/Snapshot";

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

type GetSnapshotsResponse = {
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

const parseSnapshot = (x: GetSnapshotsResponse["data"][number]): Snapshot => {
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

export default class LlamaLendService extends ServiceBase {
  private getChainName(chain: Chain): string {
    return chain === "mainnet" ? "ethereum" : chain;
  }

  public async getMarkets(chain: Chain): Promise<Market[]> {
    const resp = await this.fetch<GetMarketsResponse>(
      `${API_URL}/v1/lending/markets/${this.getChainName(
        chain
      )}?page=1&per_page=100`
    );

    return resp.data.map(parseMarket);
  }

  public async getSnapshots(
    chain: Chain,
    marketController: string
  ): Promise<Snapshot[]> {
    const resp = await this.fetch<GetSnapshotsResponse>(
      `${API_URL}/v1/lending/markets/${this.getChainName(
        chain
      )}/${marketController}/snapshots?agg=day`
    );

    return resp.data.map(parseSnapshot);
  }
}
