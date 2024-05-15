import { ServiceBase } from "@/Services";
import type * as ApiTypes from "@CM/Services/Protocol/ApiTypes";
import * as Parsers from "@CM/Services/Protocol/Parsers";

const API_URL = "https://api-py.llama.airforce/curve/v1";

export default class ProtocolService extends ServiceBase {
  public async getLiquidityTop() {
    const resp = await this.fetch<ApiTypes.GetLiquidityTopResponse>(
      `${API_URL}/protocol/liquidity/top`
    );

    return resp.liquidity_use.map(Parsers.parseLiquidityTop);
  }

  public async getTradesLarge() {
    const resp = await this.fetch<ApiTypes.GetTradesLargeResponse>(
      `${API_URL}/protocol/size/trades`
    );

    return resp.large_trades.map(Parsers.parseTradesLarge);
  }

  public async getTvlGainers() {
    const resp = await this.fetch<ApiTypes.GetTvlGainersResponse>(
      `${API_URL}/protocol/tvl/gainers`
    );

    return resp.tvl_gainers.map(Parsers.parseTvlGainer);
  }

  public async getTvlLosers() {
    const resp = await this.fetch<ApiTypes.GetTvlLosersResponse>(
      `${API_URL}/protocol/tvl/losers`
    );

    return resp.tvl_losers.map(Parsers.parseTvlLoser);
  }

  public async getTvlBreakdownType() {
    const resp = await this.fetch<ApiTypes.GetTvlBreakdownTypeResponse>(
      `${API_URL}/protocol/tvl/type_breakdown`
    );

    return resp.tvl_breakdown_type.map(Parsers.parseTvlBreakdownType);
  }

  public async getTvlBreakdownChain() {
    const resp = await this.fetch<ApiTypes.GetTvlBreakdownChainResponse>(
      `${API_URL}/protocol/tvl/chain_breakdown`
    );

    return resp.tvl_breakdown_chain.map(Parsers.parseTvlBreakdownChain);
  }

  public async getVolumeBreakdownType() {
    const resp = await this.fetch<ApiTypes.GetVolumeBreakdownTypeResponse>(
      `${API_URL}/protocol/volume/type_breakdown`
    );

    return resp.volume_breakdown_type.map(Parsers.parseVolumeBreakdownType);
  }

  public async getVolumeBreakdownChain() {
    const resp = await this.fetch<ApiTypes.GetVolumeBreakdownChainResponse>(
      `${API_URL}/protocol/volume/chain_breakdown`
    );

    return resp.volume_breakdown_chain.map(Parsers.parseVolumeBreakdownChain);
  }
}
