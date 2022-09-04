import { defineStore } from "pinia";
import Pool from "@/Pages/Curve/Models/Pool";
import Gauge, { GaugeId } from "@/Pages/Curve/Gauges/Models/Gauge";
import Fee from "@/Pages/Curve/Gauges/Models/Fee";
import Emission from "@/Pages/Curve/Gauges/Models/Emission";
import Ratio from "@/Pages/Curve/Utilization/Models/Ratio";
import Candle from "@/Pages/Curve/Prices/Models/Candle";
import Reserves from "@/Pages/Curve/Reserves/Models/Reserves";
import Volume from "@/Pages/Curve/Volume/Models/Volume";

type State = {
  pools: Pool[];
  gauges: Gauge[];
  emissions: { [pool: string]: Emission[] };
  fees: { [pool: string]: Fee[] };
  ratios: { [pool: string]: Ratio[] };
  candles: { [pool: string]: Candle[] };
  reserves: { [pool: string]: Reserves[] };
  volumes: {[pool: string]: Volume[]}
};

export const useCurveStore = defineStore({
  id: "curveStore",
  state: (): State => ({
    pools: [],
    gauges: [],
    emissions: {},
    fees: {},
    ratios: {},
    candles: {},
    reserves: {},
    volumes: {},
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
    setCandles(gauge: GaugeId, candles: Candle[]) {
      this.candles[gauge] = candles;
    },
    setReserves(gauge: GaugeId, reserves: Reserves[]) {
      this.reserves[gauge] = reserves;
    },
    setVolumes(gauge: GaugeId, volumes: Volume[]) {
      this.volumes[gauge] = volumes;
    },
  },
});
