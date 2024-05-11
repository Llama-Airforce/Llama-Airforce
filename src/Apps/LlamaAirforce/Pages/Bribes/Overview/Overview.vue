<template>
  <div class="overview">
    <div class="dashboard">
      <SystemSelect
        class="system-select"
        @select-platform="onSelectPlatform"
        @select-protocol="onSelectProtocol"
      >
      </SystemSelect>

      <Summary
        class="summary"
        :overview="overview"
      ></Summary>

      <GraphBribesRevenue
        class="graph-bribes-revenue"
        :overview="overview"
      ></GraphBribesRevenue>

      <TableRounds
        class="table-rounds"
        :overview="overview"
      ></TableRounds>
    </div>
  </div>
</template>

<script setup lang="ts">
import SystemSelect from "@LAF/Pages/Bribes/Components/SystemSelect.vue";
import GraphBribesRevenue from "@LAF/Pages/Bribes/Overview/Components/GraphBribesRevenue.vue";
import TableRounds from "@LAF/Pages/Bribes/Overview/Components/TableRounds.vue";
import Summary from "@LAF/Pages/Bribes/Overview/Components/Summary.vue";
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import type {
  OverviewId,
  Product,
  Platform,
  Protocol,
} from "@LAF/Pages/Bribes/Models";
import DashboardService from "@LAF/Pages/Bribes/Services/DashboardService";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";

const dashboardService = new DashboardService(getHost());

let isInitializing = false;

// Refs
const storeBribe = useBribesStore();
const { platform, product } = storeToRefs(storeBribe);
const { setProtocol } = storeBribe;

const router = useRouter();
const route = useRoute();

const overviewId = computed((): OverviewId | null => {
  switch (product.value?.platform) {
    case "votium":
      switch (product.value?.protocol) {
        case "cvx-crv":
          return "bribes-overview-votium";
        case "cvx-prisma":
          return "bribes-overview-prisma";
        case "cvx-fxn":
          return "bribes-overview-fxn";
        default:
          throw new Error("Unknown protocol for dashboard");
      }
    case "hh":
      return "bribes-overview-aura";
    default:
      throw new Error("Unknown platform for dashboard");
  }
});

// Data
const { data: overview } = useQuery({
  queryKey: ["bribes-overview", overviewId] as const,
  queryFn: ({ queryKey: [, overviewId] }) => {
    if (overviewId) {
      return dashboardService.getOverview(overviewId).then((x) => x.dashboard);
    }

    return undefined;
  },
});

// Hooks.
onBeforeMount(initFromRouter);
onBeforeUnmount((): void => {
  isInitializing = false;
});

// Events
const onSelectPlatform = (newPlatform: Platform, init = false): void => {
  if (isInitializing && !init) {
    return;
  }

  platform.value = newPlatform;
};

const onSelectProtocol = (newProtocol: Protocol, init = false): void => {
  if (isInitializing && !init) {
    return;
  }

  setProtocol(newProtocol);

  // Check if dashboard is loaded for this protocol.
  if (product.value?.platform && overviewId.value) {
    void updateRouter(product.value);
  }
};

// Methods
const updateRouter = async (product: Product): Promise<void> => {
  const { platform, protocol } = product;

  await router.push({
    name: "overview-incentives",
    params: { platform, protocol },
  });
};

function initFromRouter() {
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
    onSelectProtocol(paramProtocol, true);
  } else {
    // Default to default product.
    if (product.value) {
      onSelectPlatform(product.value.platform, true);
      onSelectProtocol(product.value.protocol, true);
    }
  }

  isInitializing = false;
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("overview");

.overview {
  .dashboard {
    grid-template-rows: 64px 64px auto 1fr;

    --offset: 0;

    .system-select {
      grid-column: 1;
      grid-row: calc(var(--offset) + 1);
    }

    .summary {
      grid-column: 1;
      grid-row: calc(var(--offset) + 2);
    }

    .graph-bribes-revenue {
      grid-column: 1;
      grid-row: calc(var(--offset) + 3);

      height: 370px;
    }

    .table-rounds {
      max-height: 420px;

      grid-column: 1;
      grid-row: calc(var(--offset) + 4);
    }
  }
}
</style>
