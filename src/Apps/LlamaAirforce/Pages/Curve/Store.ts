import { defineStore } from "pinia";
import Gauge, { GaugeId } from "@LAF/Pages/Curve/Gauges/Models/Gauge";
import Fee from "@LAF/Pages/Curve/Gauges/Models/Fee";
import Emission from "@LAF/Pages/Curve/Gauges/Models/Emission";
import Ratio from "@LAF/Pages/Curve/Utilization/Models/Ratio";
import PoolRevenue, {
  ChainRevenue,
  ChainTopPoolRevenue,
} from "@LAF/Pages/Curve/Revenue/Models/Revenue";
import type { Chain } from "@LAF/Pages/Curve/Revenue/Models/Chain";

type State = {
  gauges: Gauge[];
  emissions: { [pool: string]: Emission[] };
  fees: { [pool: string]: Fee[] };
  ratios: { [pool: string]: Ratio[] };
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
    ratios: {},
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
    setRatios(gauge: GaugeId, ratios: Ratio[]) {
      this.ratios[gauge] = ratios;
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
