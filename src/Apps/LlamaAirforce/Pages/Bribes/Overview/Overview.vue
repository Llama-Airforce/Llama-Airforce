<template>
  <div class="overview">
    <div class="dashboard">
      <SystemSelect
        class="system-select"
        @select-platform="onSelectPlatform"
        @select-protocol="onSelectProtocol"
      >
      </SystemSelect>

      <Summary class="summary"></Summary>
      <GraphBribesRevenue class="graph-bribes-revenue"></GraphBribesRevenue>
      <TableRounds class="table-rounds"></TableRounds>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
import SystemSelect from "@LAF/Pages/Bribes/Components/SystemSelect.vue";
import GraphBribesRevenue from "@LAF/Pages/Bribes/Overview/Components/GraphBribesRevenue.vue";
import TableRounds from "@LAF/Pages/Bribes/Overview/Components/TableRounds.vue";
import Summary from "@LAF/Pages/Bribes/Overview/Components/Summary.vue";
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import type {
  Overview,
  OverviewId,
  Product,
  Platform,
  Protocol,
} from "@LAF/Pages/Bribes/Models";
import DashboardService from "@LAF/Pages/Bribes/Services/DashboardService";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getHost } from "@/Services/Host";

const dashboardService = new DashboardService(getHost());

let isInitializing = false;

// Refs
const store = useBribesStore();
const router = useRouter();
const route = useRoute();

const product = computed((): Product | null => {
  const platform = store.selectedPlatform;
  const protocol = store.selectedProtocol;

  if (!platform || !protocol) return null;

  return {
    platform,
    protocol,
  };
});

const overviewId = computed((): OverviewId | null => {
  switch (product.value?.platform) {
    case "votium":
      return "bribes-overview-votium";
    case "hh":
      return "bribes-overview-aura";
    default:
      throw new Error("Unknown platform for dashboard");
  }
});

// Hooks.
onBeforeMount(async (): Promise<void> => {
  await initFromRouter();
});

onBeforeUnmount((): void => {
  isInitializing = false;
});

// Events
const onSelectPlatform = (platform: Platform, init = false): void => {
  if (isInitializing && !init) {
    return;
  }

  store.selectedPlatform = platform;
};

const findOrGetDashboard = async (
  overviewId: OverviewId
): Promise<Overview | null> => {
  const dashboardLoaded = store.overviews[overviewId];
  if (dashboardLoaded) {
    return dashboardLoaded;
  }

  const { dashboard } = await dashboardService.getOverview(overviewId);

  if (dashboard) {
    store.setOverview(dashboard);
  }

  return dashboard ?? null;
};

const onSelectProtocol = async (
  protocol: Protocol,
  init = false
): Promise<void> => {
  if (isInitializing && !init) {
    return;
  }

  store.selectedProtocol = protocol;

  // Check if dashboard is loaded for this protocol.
  const platform = product.value?.platform;
  if (platform && overviewId.value) {
    const dashboard = await findOrGetDashboard(overviewId.value);

    if (dashboard) {
      store.selectedOverview = dashboard;

      if (product.value) void updateRouter(product.value);
    }
  }
};

// Methods
const updateRouter = async (product: Product): Promise<void> => {
  const { platform, protocol } = product;

  await router.push({
    name: "overview",
    params: { platform, protocol },
  });
};

const initFromRouter = async (): Promise<void> => {
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  const paramPlatform = route.params.platform;
  const paramProtocol = route.params.protocol;

  if (
    paramPlatform &&
    typeof paramPlatform === "string" &&
    isPlatform(paramPlatform) &&
    paramProtocol &&
    typeof paramProtocol === "string" &&
    isProtocol(paramProtocol)
  ) {
    onSelectPlatform(paramPlatform, true);
    await onSelectProtocol(paramProtocol, true);
  } else {
    // Default to default product.
    if (product.value) {
      onSelectPlatform(product.value.platform, true);
      await onSelectProtocol(product.value.protocol, true);
    }
  }

  isInitializing = false;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("overview");

.overview {
  .dashboard {
    grid-template-rows: 64px 64px auto 1fr;

    .system-select {
      grid-column: 1;
      grid-row: 1;
    }

    .summary {
      grid-column: 1;
      grid-row: 2;
    }

    .graph-bribes-revenue {
      grid-column: 1;
      grid-row: 3;

      height: 370px;
    }

    .table-rounds {
      max-height: 420px;

      grid-column: 1;
      grid-row: 4;
    }
  }
}
</style>
