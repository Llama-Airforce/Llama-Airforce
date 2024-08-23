<script setup lang="ts">
import SelectSystem from "@LAF/Pages/Bribes/Components/SelectSystem.vue";
import ChartBribesRevenue from "@LAF/Pages/Bribes/Overview/Components/ChartBribesRevenue.vue";
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

const dashboardService = new DashboardService(useHost());

let isInitializing = false;

// Refs
const storeBribe = useBribesStore();
const { platform, product } = storeToRefs(storeBribe);
const { setProtocol } = storeBribe;

const router = useRouter();

const paramPlatform = useRouteParams<string>("platform");
const paramProtocol = useRouteParams<string>("protocol");

const overviewId = computed((): OverviewId | null => {
  switch (product.value?.platform) {
    case "votium":
      switch (product.value.protocol) {
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

  if (isPlatform(paramPlatform.value) && isProtocol(paramProtocol.value)) {
    onSelectPlatform(paramPlatform.value, true);
    onSelectProtocol(paramProtocol.value, true);
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

<template>
  <div class="overview">
    <div class="dashboard">
      <SelectSystem
        style="grid-area: select-system"
        @select-platform="onSelectPlatform"
        @select-protocol="onSelectProtocol"
      >
      </SelectSystem>

      <Summary
        style="grid-area: summary"
        :overview="overview"
      ></Summary>

      <ChartBribesRevenue
        style="grid-area: chart; height: 370px"
        :overview="overview"
      ></ChartBribesRevenue>

      <TableRounds
        style="grid-area: table; height: 420px"
        :overview="overview"
      ></TableRounds>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("overview");

.overview {
  .dashboard {
    grid-template-columns: 1fr;
    grid-template-rows: auto auto auto auto;
    grid-template-areas:
      "select-system"
      "summary"
      "chart"
      "table";
  }
}
</style>
