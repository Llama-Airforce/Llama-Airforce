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

<script
  setup
  lang="ts"
>
import { onBeforeMount, onBeforeUnmount } from "vue";
import { $computed } from "vue/macros";
import { useRouter, useRoute } from "vue-router";
import SystemSelect from "@/Pages/Bribes/Components/SystemSelect.vue";
import GraphBribesRevenue from "@/Pages/Bribes/Overview/Components/GraphBribesRevenue.vue";
import TableRounds from "@/Pages/Bribes/Overview/Components/TableRounds.vue";
import Summary from "@/Pages/Bribes/Overview/Components/Summary.vue";
import type { Overview, OverviewId } from "@/Pages/Bribes/Models/Overview";
import DashboardService from "@/Pages/Bribes/Services/DashboardService";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { isPlatform, Platform } from "@/Pages/Bribes/Models/Platform";
import { isProtocol, Protocol } from "@/Pages/Bribes/Models/Protocol";
import type { Product } from "@/Pages/Bribes/Models/Product";
import { getHost } from "@/Services/Host";

const dashboardService = new DashboardService(getHost());

let isInitializing = false;

// Refs
const store = useBribesStore();
const router = useRouter();
const route = useRoute();

const product = $computed((): Product | null => {
  const platform = store.selectedPlatform;
  const protocol = store.selectedProtocol;

  if (!platform || !protocol) return null;

  return {
    platform,
    protocol,
  };
});

const overviewId = $computed((): OverviewId | null => {
  switch (product?.platform) {
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
  const platform = product?.platform;
  if (platform && overviewId) {
    const dashboard = await findOrGetDashboard(overviewId);

    if (dashboard) {
      store.selectedOverview = dashboard;

      if (product) void updateRouter(product);
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
    if (product) {
      onSelectPlatform(product.platform, true);
      await onSelectProtocol(product.protocol, true);
    }
  }

  isInitializing = false;
};
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.overview {
  display: flex;
  justify-content: center;

  .dashboard {
    padding: $page-margin;
    width: 100%;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: 64px 64px auto 1fr;
    grid-template-columns: 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

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
