import { defineStore } from "pinia";
import Gauge, { GaugeId } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import Fee from "@CM/Pages/Platform/Gauges/Models/Fee";
import Emission from "@CM/Pages/Platform/Gauges/Models/Emission";
import PoolRevenue, {
  ChainRevenue,
  ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Models/Revenue";
import type { Chain } from "@CM/Pages/Platform/Revenue/Models/Chain";

type State = {
  gauges: Gauge[];
  emissions: { [pool: string]: Emission[] };
  fees: { [pool: string]: Fee[] };
  poolRevenues: PoolRevenue[];
  chainRevenues: ChainRevenue[];
  selectedChain: Chain | null;
  topPools: { [chain: string]: ChainTopPoolRevenue[] };
};

export const useCurveStore = defineStore({
  id: "curveStore",
  state: (): State => ({
    gauges: [],
    emissions: {},
    fees: {},
    poolRevenues: [],
    chainRevenues: [],
    selectedChain: "mainnet",
    topPools: {},
  }),
  actions: {
    setEmissions(gauge: GaugeId, emissions: Emission[]) {
      this.emissions[gauge] = emissions;
    },
    setFees(gauge: GaugeId, fees: Fee[]) {
      this.fees[gauge] = fees;
    },
    setPoolRevenues(poolRevenues: PoolRevenue[]) {
      this.poolRevenues = poolRevenues;
    },
    setChainRevenues(chainRevenues: ChainRevenue[]) {
      this.chainRevenues = chainRevenues;
    },
    setTopPools(chain: string, topPools: ChainTopPoolRevenue[]) {
      this.topPools[chain] = topPools;
    },
  },
});
