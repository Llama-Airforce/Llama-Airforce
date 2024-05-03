import { defineStore } from "pinia";
import type { Chain } from "@CM/Models/Chain";
import {
  type Gauge,
  type GaugeId,
} from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { type Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";
import {
  type BreakdownRevenue,
  type ChainRevenue,
  type ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Services/RevenueService";

type State = {
  gauges: Gauge[];
  emissions: { [pool: string]: Emission[] };
  fees: { [pool: string]: Fee[] };
  breakdown: BreakdownRevenue[];
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
    breakdown: [],
    chainRevenues: [],
    selectedChain: "ethereum",
    topPools: {},
  }),
  actions: {
    setEmissions(gauge: GaugeId, emissions: Emission[]) {
      this.emissions[gauge] = emissions;
    },
    setFees(gauge: GaugeId, fees: Fee[]) {
      this.fees[gauge] = fees;
    },
    setTopPools(chain: string, topPools: ChainTopPoolRevenue[]) {
      this.topPools[chain] = topPools;
    },
  },
});
