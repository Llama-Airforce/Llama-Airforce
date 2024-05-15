import { ref } from "vue";
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
} from "@CM/Services/Revenue";

export const useCurveStore = defineStore("curveStore", () => {
  const gauges = ref<Gauge[]>([]);
  const emissions = ref<{ [pool: string]: Emission[] }>({});
  const fees = ref<{ [pool: string]: Fee[] }>({});
  const breakdown = ref<BreakdownRevenue[]>([]);
  const chainRevenues = ref<ChainRevenue[]>([]);
  const selectedChain = ref<Chain | null>("ethereum");
  const topPools = ref<{ [chain: string]: ChainTopPoolRevenue[] }>({});

  function setEmissions(gauge: GaugeId, newEmissions: Emission[]) {
    emissions.value[gauge] = newEmissions;
  }

  function setFees(gauge: GaugeId, newFees: Fee[]) {
    fees.value[gauge] = newFees;
  }

  function setTopPools(chain: string, newTopPools: ChainTopPoolRevenue[]) {
    topPools.value[chain] = newTopPools;
  }

  return {
    gauges,
    emissions,
    fees,
    breakdown,
    chainRevenues,
    selectedChain,
    topPools,
    setEmissions,
    setFees,
    setTopPools,
  };
});
