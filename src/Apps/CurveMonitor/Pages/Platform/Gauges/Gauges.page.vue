<template>
  <div class="gauges">
    <TableGauges
      class="gauges-table"
      :expanded="expanded"
      @selected="onSelected"
    ></TableGauges>
  </div>
</template>

<script setup lang="ts">
import TableGauges from "@CM/Pages/Platform/Gauges/Tables/TableGauges.vue";
import { type Gauge } from "@CM/Pages/Platform/Gauges/Models/Gauge";
import GaugeService from "@CM/Pages/Platform/Gauges/Services/GaugeService";
import GaugeSnapshotsService from "@CM/Pages/Platform/Gauges/Services/GaugeSnapshotsService";
import { useCurveStore } from "@CM/Pages/Platform/Store";

let isMounted = false;

const gaugeService = new GaugeService(useHost());
const gaugeSnapshotsService = new GaugeSnapshotsService(useHost());

// Refs
const store = useCurveStore();
const router = useRouter();

const gauge = useRouteParams<string>("gauge");

const { expanded, toggleExpansion } = useExpansion<Gauge>();

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

    if (gauge.value) {
      routeExpandGauge(gauge.value);
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
    const expanded = toggleExpansion(gaugeFound);
    if (expanded) {
      void getSnapshots(gaugeFound);
    }
  }
};

// Events
const onSelected = async (gauge: Gauge): Promise<void> => {
  const expanded = toggleExpansion(gauge);

  if (expanded) {
    void getSnapshots(gauge);
    await router.push({
      name: "curvegauges",
      params: { gauge: shorten(gauge.name) },
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("gauges");

.gauges {
  max-width: calc(1920px - 18.125rem);

  .gauges-table {
    grid-column: 1;
    grid-row: 1;
  }
}
</style>
