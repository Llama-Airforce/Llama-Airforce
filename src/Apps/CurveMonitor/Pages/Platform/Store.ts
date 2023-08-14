import { defineStore } from "pinia";
import type { Chain } from "@CM/Models/Chain";
import {
  type Gauge,
  type GaugeId,
} from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { type Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";
import {
  type BreakdownRevenueV1,
  type BreakdownRevenueV2,
  type ChainRevenue,
  type ChainTopPoolRevenue,
} from "@CM/Pages/Platform/Revenue/Services/RevenueService";

type State = {
  gauges: Gauge[];
  emissions: { [pool: string]: Emission[] };
  fees: { [pool: string]: Fee[] };
  poolRevenues: BreakdownRevenueV1[];
  breakdown: BreakdownRevenueV2[];
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
    breakdown: [],
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
    setPoolRevenues(poolRevenues: BreakdownRevenueV1[]) {
      this.poolRevenues = poolRevenues;
    },
    setBreakdown(breakdown: BreakdownRevenueV2[]) {
      this.breakdown = breakdown;
    },
    setChainRevenues(chainRevenues: ChainRevenue[]) {
      this.chainRevenues = chainRevenues;
    },
    setTopPools(chain: string, topPools: ChainTopPoolRevenue[]) {
      this.topPools[chain] = topPools;
    },
  },
});
