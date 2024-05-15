import { ref } from "vue";
import { defineStore } from "pinia";
import {
  type Gauge,
  type GaugeId,
} from "@CM/Pages/Platform/Gauges/Models/Gauge";
import { type Fee } from "@CM/Pages/Platform/Gauges/Models/Fee";
import { type Emission } from "@CM/Pages/Platform/Gauges/Models/Emission";

export const useCurveStore = defineStore("curveStore", () => {
  const gauges = ref<Gauge[]>([]);
  const emissions = ref<{ [pool: string]: Emission[] }>({});
  const fees = ref<{ [pool: string]: Fee[] }>({});

  function setEmissions(gauge: GaugeId, newEmissions: Emission[]) {
    emissions.value[gauge] = newEmissions;
  }

  function setFees(gauge: GaugeId, newFees: Fee[]) {
    fees.value[gauge] = newFees;
  }

  return {
    gauges,
    emissions,
    fees,
    setEmissions,
    setFees,
  };
});
