import { ServiceBase } from "@/Services";
import type { Chain } from "@CM/Models/Chain";

const API_URL = "https://api-py.llama.airforce/curve/v1";

type Liquidity = {
  pool: string;
  chain: Chain;
  name: string;
  liq_use: number;
};

type Trade = {
  pool: string;
  chain: Chain;
  name: string;
  tx: string;
  value: number;
};

type TvlGrower = {
  pool: string;
  chain: Chain;
  name: string;
  tvl_growth: number;
};

type TvlBreakdownType = {
  type: string;
  tvl: number;
};

type TvlBreakdownChain = {
  chain: Chain;
  tvl: number;
};

type VolumeBreakdownType = {
  type: string;
  volumeUSD: number;
};

type VolumeBreakdownChain = {
  chain: Chain;
  volumeUSD: number;
};

export default class CurveService extends ServiceBase {
  public async getLiquidityTop(): Promise<{ liquidity_use: Liquidity[] }> {
    return this.fetch(`${API_URL}/protocol/liquidity/top`);
  }

  public async getTradesLarge(): Promise<{ large_trades: Trade[] }> {
    return this.fetch(`${API_URL}/protocol/size/trades`);
  }

  public async getTvlGainers(): Promise<{ tvl_gainers: TvlGrower[] }> {
    return this.fetch(`${API_URL}/protocol/tvl/gainers`);
  }

  public async getTvlLosers(): Promise<{ tvl_losers: TvlGrower[] }> {
    return this.fetch(`${API_URL}/protocol/tvl/losers`);
  }

  public async getTvlBreakdownType(): Promise<{
    tvl_breakdown_type: TvlBreakdownType[];
  }> {
    return this.fetch(`${API_URL}/protocol/tvl/type_breakdown`);
  }

  public async getTvlBreakdownChain(): Promise<{
    tvl_breakdown_chain: TvlBreakdownChain[];
  }> {
    return this.fetch(`${API_URL}/protocol/tvl/chain_breakdown`);
  }

  public async getVolumeBreakdownType(): Promise<{
    volume_breakdown_type: VolumeBreakdownType[];
  }> {
    return this.fetch(`${API_URL}/protocol/volume/type_breakdown`);
  }

  public async getVolumeBreakdownChain(): Promise<{
    volume_breakdown_chain: VolumeBreakdownChain[];
  }> {
    return this.fetch(`${API_URL}/protocol/volume/chain_breakdown`);
  }
}
