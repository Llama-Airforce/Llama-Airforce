import { ref } from "vue";
import { defineStore } from "pinia";
import { type Pool } from "@CM/Pages/Convex/Pools/Models/Pool";
import { type Snapshot } from "@CM/Pages/Convex/Pools/Models/Snapshot";
import {
  EmptyHistoricalRevenue,
  EmptyProtocolRevenue,
  type HistoricalRevenue,
  type ProtocolRevenue,
} from "@CM/Pages/Convex/Revenue/Models/Revenue";

export const useConvexStore = defineStore("convexStore", () => {
  const pools = ref<Pool[]>([]);
  const snapshots = ref<{ [pool: string]: Snapshot[] }>({});
  const revenue = ref<ProtocolRevenue>(EmptyProtocolRevenue);
  const historicalRevenue = ref<HistoricalRevenue[]>([EmptyHistoricalRevenue]);

  function setSnapshots(pool: Pool, snapshotsData: Snapshot[]) {
    snapshots.value[pool.name] = snapshotsData;
  }

  return {
    pools,
    snapshots,
    revenue,
    historicalRevenue,

    setSnapshots,
  };
});
