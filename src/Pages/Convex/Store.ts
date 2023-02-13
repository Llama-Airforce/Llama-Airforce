import { defineStore } from "pinia";
import Pool from "@/Pages/Convex/Pools/Models/Pool";
import Snapshot from "@/Pages/Convex/Pools/Models/Snapshot";
import {
  EmptyHistoricalRevenue,
  EmptyProtocolRevenue,
  HistoricalRevenue,
  ProtocolRevenue,
} from "@/Pages/Convex/Revenue/Models/Revenue";

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
