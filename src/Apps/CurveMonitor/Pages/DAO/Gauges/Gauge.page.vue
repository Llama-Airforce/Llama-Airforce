<script setup lang="ts">
import { useQueryGauge } from "@CM/Services/Gauge/Queries";
import GaugeOverview from "@CM/Pages/DAO/Gauges/Tabs/GaugeOverview.vue";
import Votes from "@CM/Pages/DAO/Gauges/Tabs/Votes.vue";

const gaugeAddr = useRouteParams<string>("gaugeAddr");
const { isFetching: loading, data: gauge } = useQueryGauge(gaugeAddr);

const { crumbs } = storeToRefs(useBreadcrumbStore());
watch(
  gauge,
  (gauge) => {
    crumbs.value = [
      {
        id: "gauges",
        label: "Gauges",
        pathName: "gauges",
      },
      {
        id: "gauge",
        label: `Gauge: ${gauge?.name ?? gauge?.address ?? "?"}`,
      },
    ];
  },
  { immediate: true }
);

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "votes"],
  "gauge",
  () => ({
    gaugeAddr: gaugeAddr.value,
  })
);
</script>

<template>
  <div class="dashboard">
    <Spinner :loading />

    <TabView
      v-if="!loading && gauge"
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <GaugeOverview
            v-if="tabActive === 'overview'"
            :gauge
          />
        </KeepAlive>
      </TabItem>

      <TabItem header="Votes">
        <KeepAlive>
          <Votes
            v-if="tabActive === 'votes'"
            :gauge
          />
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style scoped>
.dashboard {
  position: relative;
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;

  .spinner {
    position: absolute;
    top: 50vh;
    top: 50dvh;
    left: 50%;
    transform: translateY(-50%) translateX(-50%);
  }
}
</style>
