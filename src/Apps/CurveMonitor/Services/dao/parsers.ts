import { toUTC } from "../";
import type * as ApiTypes from "./apiTypes";
import type * as Models from "./models";

export const parseVotesOverview = (
  x: ApiTypes.GetVotesOverviewResponse["data"][number]
): Models.VotesOverview => {
  return {
    proposals: x.proposals,
    votesProposals: x.prop_votes,
    votesGauges: x.gauge_votes,
    votersUnique: x.prop_unique_voters,
    epoch: x.epoch,
  };
};

export const parseLocksDaily = (
  x: ApiTypes.GetLocksDailyResponse["locks"][number]
): Models.LocksDaily => {
  return {
    day: toUTC(x.day),
    amount: BigInt(x.amount),
  };
};

export const parseUserLock = (
  x: ApiTypes.GetUserLocksResponse["locks"][number]
): Models.UserLock => {
  return {
    timestamp: toUTC(x.dt),
    amount: BigInt(Math.round(parseFloat(x.amount))),
    unlockTime: x.unlock_time,
    lockType: x.lock_type as Models.UserLock["lockType"],
    lockedBalance: BigInt(Math.round(parseFloat(x.locked_balance))),
    txHash: x.transaction_hash,
  };
};

export const parseSupply = (
  x: ApiTypes.GetSupplyResponse["supply"][number]
): Models.Supply => {
  return {
    timestamp: toUTC(x.dt),
    veCrvTotal: BigInt(x.total_vecrv),
    crvEscrowed: BigInt(x.escrowed_crv),
    crvSupply: BigInt(x.crv_supply),
    circulatingSupply: BigInt(x.circulating_supply),
    lockedSupplyDetails: x.locked_supply_details.map((y) => ({
      address: y.address.toLocaleLowerCase(),
      label: y.label,
      locked: BigInt(y.locked),
    })),
    blockNumber: x.block_number,
    txHash: x.transaction_hash,
  };
};

export const parseLockers = (
  x: ApiTypes.GetLockersResponse["users"][number]
): Models.Locker => {
  return {
    user: x.user.toLocaleLowerCase(),
    locked: BigInt(Math.round(parseFloat(x.locked))),
    weight: BigInt(Math.round(parseFloat(x.weight))),
    weightRatio: parseFloat(x.weight_ratio.slice(0, -1)),
    unlockTime: x.unlock_time,
  };
};
