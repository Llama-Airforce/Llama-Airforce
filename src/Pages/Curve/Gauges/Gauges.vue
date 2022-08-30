<template>
  <div class="gauges">
    <div class="dashboard">
      <TableGauges
        class="datatable-gauges"
        :expanded="expanded"
        @selected="onSelected"
      ></TableGauges>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { onMounted, onBeforeUnmount } from "vue";
import { $ref } from "vue/macros";
import { useRoute, useRouter } from "vue-router";
import TableGauges from "@/Pages/Curve/Gauges/Components/TableGauges.vue";
import Gauge from "@/Pages/Curve/Gauges/Models/Gauge";
import GaugeService from "@/Pages/Curve/Gauges/Services/GaugeService";
import GaugeSnapshotsService from "@/Pages/Curve/Gauges/Services/GaugeSnapshotsService";
import { minDelay } from "@/Util/PromiseHelper";
import { useCurveStore } from "@/Pages/Curve/Store";
import { shorten, longen } from "@/Util/PoolHelper";
import { getHost } from "@/Services/Host";

let isMounted = false;

const gaugeService = new GaugeService(getHost());
const gaugeSnapshotsService = new GaugeSnapshotsService(getHost());

// Refs
const store = useCurveStore();
const route = useRoute();
const router = useRouter();

let expanded: Gauge[] = $ref([]);

onMounted(async (): Promise<void> => {
  isMounted = true;

  const resp = await minDelay(gaugeService.get());
  if (resp) {
    const gauges = resp.pools;

    // Order descending by TVL.
    gauges.sort((x: Gauge, y: Gauge) => y.tvl - x.tvl);
    store.gauges = gauges;

    /*
     * Select first gauge by default if none given by the URL.
     * It's possible the component has unmounted before we arrive here.
     */
    if (!isMounted) {
      return;
    }

    const gaugeParam = route.params.gauge;
    if (gaugeParam && typeof gaugeParam === "string") {
      routeExpandGauge(gaugeParam);
    }
  }
});

onBeforeUnmount((): void => {
  isMounted = false;
});

// Events
const getSnapshots = async (gauge?: Gauge): Promise<void> => {
  if (!gauge) {
    return;
  }

  // Don't request new snapshots if there's already cached.
  if (store.fees[gauge.name] && store.emissions[gauge.name]) {
    return;
  }

  // Introduce delay so the animation doesn't lag immediately.
  const resp = await minDelay(gaugeSnapshotsService.get(gauge), 500);

  if (resp) {
    const fees = resp.data.feeSnapshots;
    const emissions = resp.data.emissionSnapshots;

    store.setFees(gauge.name, fees);
    store.setEmissions(gauge.name, emissions);
  }
};

const routeExpandGauge = (gaugeRoute: string): void => {
  const gaugeName = longen(gaugeRoute);
  const gaugeFound = store.gauges.find((gauge) => gauge.name === gaugeName);
  if (gaugeFound) {
    toggleExpansion(gaugeFound);
  }
};

const toggleExpansion = (gauge: Gauge): boolean => {
  if (!expanded.includes(gauge)) {
    void getSnapshots(gauge);
    expanded.push(gauge);
    return true;
  } else {
    expanded = expanded.filter((x) => x !== gauge);
    return false;
  }
};

// Events
const onSelected = async (gauge: Gauge): Promise<void> => {
  const expanded = toggleExpansion(gauge);

  if (expanded) {
    await router.push({
      name: "curvegauges",
      params: { gauge: shorten(gauge.name) },
    });
  }
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.gauges {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .datatable-gauges {
      grid-column: 1;
      grid-row: 1;
    }
  }
}
</style>
