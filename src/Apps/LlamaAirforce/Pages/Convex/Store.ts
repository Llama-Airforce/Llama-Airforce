import { defineStore } from "pinia";
import { type Pool } from "@LAF/Pages/Convex/Pools/Models/Pool";
import { type Snapshot } from "@LAF/Pages/Convex/Pools/Models/Snapshot";
import {
  EmptyHistoricalRevenue,
  EmptyProtocolRevenue,
  type HistoricalRevenue,
  type ProtocolRevenue,
} from "@LAF/Pages/Convex/Revenue/Models/Revenue";

type State = {
  pools: Pool[];
  snapshots: { [pool: string]: Snapshot[] };
  revenue: ProtocolRevenue;
  historicalRevenue: HistoricalRevenue[];
};

export const useConvexStore = defineStore({
  id: "convexStore",
  state: (): State => ({
    pools: [],
    snapshots: {},
    revenue: EmptyProtocolRevenue,
    historicalRevenue: [EmptyHistoricalRevenue],
  }),
  actions: {
    setSnapshots(pool: Pool, snapshots: Snapshot[]) {
      this.snapshots[pool.name] = snapshots;
    },
  },
});
