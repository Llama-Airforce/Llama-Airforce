import { last } from "lodash";
import { type Snapshot } from "@LAF/Pages/Convex/Pools/Models/Snapshot";

export function totalApr(snapshot: Snapshot): number {
  return (
    snapshot.baseApr +
    snapshot.crvApr +
    snapshot.cvxApr +
    snapshot.extraRewardsApr
  );
}

export function startDate(snapshots: Snapshot[]): Date {
  const start = last(snapshots);
  return new Date((start ? start.timeStamp : 0) * 1000);
}
