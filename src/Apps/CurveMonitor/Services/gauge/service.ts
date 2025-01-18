import { ServiceBase } from "@/Services";
import type * as ApiTypes from "./apiTypes";
import * as Parsers from "./parsers";

const API_URL = "https://prices.curve.fi";

export default class GaugeService extends ServiceBase {
  public async getGauges() {
    const resp = await this.fetch<ApiTypes.GetGaugesResponse>(
      `${API_URL}/v1/dao/gauges/overview`
    );

    return resp.gauges.map(Parsers.parseGauge);
  }

  public async getGauge(gaugeAddress: string) {
    const resp = await this.fetch<ApiTypes.GetGaugeResponse>(
      `${API_URL}/v1/dao/gauges/${gaugeAddress}/metadata`
    );

    return Parsers.parseGauge(resp);
  }

  public async getVotes(gaugeAddress: string) {
    const resp = await this.fetch<ApiTypes.GetVotesResponse>(
      `${API_URL}/v1/dao/gauges/${gaugeAddress}/votes`
    );

    return resp.votes.map(Parsers.parseVote);
  }

  public async getWeightHistory(gaugeAddress: string) {
    const resp = await this.fetch<ApiTypes.GetWeightHistoryResponse>(
      `${API_URL}/v1/dao/gauges/${gaugeAddress}/weight_history`
    );

    return resp.data.map(Parsers.parseWeightHistory);
  }

  public async getDeployment(gaugeAddress: string) {
    const resp = await this.fetch<ApiTypes.GetDeploymentResponse>(
      `${API_URL}/v1/dao/gauges/${gaugeAddress}/deployment`
    );

    return Parsers.parseDeployment(resp);
  }

  public async getUserGaugeVotes(user: string) {
    const resp = await this.fetch<ApiTypes.GetUserGaugeVotesResponse>(
      `${API_URL}/v1/dao/gauges/votes/user/${user}`
    );

    return resp.votes.map(Parsers.parseUserGaugeVote);
  }
}
