import { toUTC } from "@CM/Services";
import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parseUserGaugeVote = (
  x: ApiTypes.GetUserGaugeVotes["votes"][number]
): Models.UserGaugeVote => {
  return {
    gauge: x.gauge.toLocaleLowerCase(),
    gaugeName: x.gauge_name,
    weight: x.weight,
    blockNumber: x.block_number,
    timestamp: toUTC(x.timestamp),
    txHash: x.transaction,
  };
};
