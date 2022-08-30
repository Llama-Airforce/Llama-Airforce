import { defineStore } from "pinia";
import Pool from "@/Pages/Convex/Pools/Models/Pool";
import Snapshot from "@/Pages/Convex/Pools/Models/Snapshot";

type State = {
  pools: Pool[];
  snapshots: { [pool: string]: Snapshot[] };
};

export const useConvexStore = defineStore({
  id: "convexStore",
  state: (): State => ({
    pools: [],
    snapshots: {},
  }),
  actions: {
    setSnapshots(pool: Pool, snapshots: Snapshot[]) {
      this.snapshots[pool.name] = snapshots;
    },
  },
});
