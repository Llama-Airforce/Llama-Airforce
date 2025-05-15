<script setup lang="ts">
import createChartOptions, { createAreaSerie } from "@/Styles/ChartStylesLW";
import { useQueryUserMarketSnapshots as useQuerySnapshotsCrvUsd } from "@CM/queries/crvusd";
import { useQueryUserMarketSnapshots as useQuerySnapshotsLending } from "@CM/queries/llamalend";
import type { Chain } from "@curvefi/prices-api";

export type Serie = "borrowed" | "collateral";
const serie = ref<Serie>("borrowed");

const { type, user, chain, controller } = defineProps<{
  type: "lending" | "crvusd";
  user: string | undefined;
  chain: Chain | undefined;
  controller: string | undefined;
}>();

const { isFetching: loading, data } =
  type === "lending"
    ? useQuerySnapshotsLending(
        toRef(() => user),
        toRef(() => chain),
        toRef(() => controller)
      )
    : useQuerySnapshotsCrvUsd(
        toRef(() => user),
        toRef(() => chain),
        toRef(() => controller)
      );

// Chart
const theme = useTheme();

const card = useTemplateRef("card");

const { chart, series } = useLightweightChart({
  createChartOptions: createChartOptions(),
  series: [
    createAreaSerie({
      name: "borrowed" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: "volume",
    }),
    createAreaSerie({
      name: "collateral" as const,
      color: computed(() => theme.value.colors.blue),
      formatter: "volume",
    }),
  ],
});

const hasData = computed(() => data.value.length > 0);

watchEffect(createSeries);
function createSeries() {
  if (!chart.value || !series.borrowed || !series.collateral) {
    return;
  }

  series.borrowed.setData(
    data.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: "borrowed" in x ? x.borrowed : x.stablecoin,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  series.collateral.setData(
    data.value
      .map((x) => ({
        time: x.timestamp.getUTCTimestamp(),
        value: x.collateral,
      }))
      .uniqWith((x, y) => x.time === y.time)
      .orderBy((c) => c.time, "asc")
  );

  series.borrowed.applyOptions({ visible: serie.value === "borrowed" });
  series.collateral.applyOptions({ visible: serie.value === "collateral" });

  chart.value.timeScale().fitContent();
}
</script>

<template>
  <Card
    ref="card"
    title="Snapshots"
    :loading
  >
    <template #actions>
      <div
        v-if="hasData"
        style="display: flex"
      >
        <BtnChartLWExport
          filename="snapshots"
          :series
        />

        <BtnChartLWFullscreen
          :chart
          :target="card"
        />
      </div>
    </template>

    <template #actions-secondary>
      <div
        v-if="hasData"
        class="button-group"
      >
        <ButtonToggle
          :model-value="serie === 'borrowed'"
          @click="serie = 'borrowed'"
        >
          Borrowed
        </ButtonToggle>

        <ButtonToggle
          :model-value="serie === 'collateral'"
          @click="serie = 'collateral'"
        >
          Collateral
        </ButtonToggle>
      </div>
    </template>

    <div
      v-if="hasData"
      ref="chartRef"
      class="chart"
    ></div>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(
        user
      )} had no market events for market ${addressShort(controller)}`"
    />
  </Card>
</template>
