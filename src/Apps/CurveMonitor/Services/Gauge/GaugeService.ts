import { ServiceBase } from "@/Services";
import type * as ApiTypes from "./ApiTypes";
import * as Parsers from "./Parsers";

const API_URL = "https://prices.curve.fi";

export default class GaugeService extends ServiceBase {
  public async getUserGaugeVotes(user: string) {
    const resp = await this.fetch<ApiTypes.GetUserGaugeVotes>(
      `${API_URL}/v1/dao/gauges/votes/user/${user}`
    );

    return resp.votes.map(Parsers.parseUserGaugeVote);
  }
}
