<template>
  <div class="bribes">
    <div class="dashboard">
      <SystemSelect
        class="system-select"
        @select-platform="onSelectPlatform"
        @select-protocol="onSelectProtocol"
      >
      </SystemSelect>

      <Summary
        class="summary"
        :rounds="rounds"
        :epoch="epoch"
        @select-round="onSelectRound"
      ></Summary>

      <ChartBribesRound
        class="graph-bribes-round"
        :epoch="epoch"
      ></ChartBribesRound>

      <TablePersonal
        class="datatable-personal"
        :epoch="epoch"
      ></TablePersonal>

      <TableBribed
        class="datatable-bribed"
        :epoch="epoch"
      ></TableBribed>
    </div>
  </div>
</template>

<script setup lang="ts">
import SystemSelect from "@LAF/Pages/Bribes/Components/SystemSelect.vue";
import Summary from "@LAF/Pages/Bribes/Rounds/Components/Summary.vue";
import TableBribed from "@LAF/Pages/Bribes/Rounds/Components/TableBribed.vue";
import TablePersonal from "@LAF/Pages/Bribes/Rounds/Components/TablePersonal.vue";
import ChartBribesRound from "@LAF/Pages/Bribes/Rounds/Components/ChartBribesRound.vue";
import type { Platform, Protocol, Product } from "@LAF/Pages/Bribes/Models";
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import AuraBribesService from "@LAF/Pages/Bribes/Services/AuraBribesService";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";

let isInitializing = false;

// Refs
const storeBribe = useBribesStore();
const { platform, product } = storeToRefs(storeBribe);
const { setProtocol } = storeBribe;

const round = ref<number | undefined>(undefined);

const router = useRouter();

const paramRound = useRouteParams("round", 0, { transform: Number });
const paramPlatform = useRouteParams<string>("platform");
const paramProtocol = useRouteParams<string>("protocol");

const bribesService = computed(
  (): BribesService =>
    product.value?.protocol === "aura-bal"
      ? new AuraBribesService(getHost())
      : new BribesService(getHost())
);

// Data
const { data: rounds } = useQuery({
  queryKey: ["bribes-rounds", product] as const,
  queryFn: ({ queryKey: [, product] }) => {
    if (product && bribesService.value) {
      return bribesService.value.rounds(product).then((x) => x.rounds);
    }

    return [] as number[];
  },
  initialData: [],
  initialDataUpdatedAt: 0,
});

const { data: epoch } = useQuery({
  queryKey: ["bribes-epoch", product, round] as const,
  queryFn: ({ queryKey: [, product, round] }) => {
    if (product && round && bribesService.value) {
      return bribesService.value
        .getEpoch({
          platform: product.platform,
          protocol: product.protocol,
          round,
        })
        .then((x) => x.epoch);
    }

    return undefined;
  },
  initialData: undefined,
  initialDataUpdatedAt: 0,
  enabled: () => !!round.value,
});

// Hooks.
onBeforeMount(initFromRouter);
onBeforeUnmount((): void => {
  isInitializing = false;
});

// Watches
watch(
  rounds,
  (newRounds) => {
    if (!round.value) {
      round.value = newRounds.at(-1);
    }
  },
  { immediate: true }
);

watch(round, (newRound) => {
  if (product.value && newRound) {
    void updateRouter(product.value, newRound);
  }
});

// Events
const onSelectPlatform = (newPlatform: Platform, init = false): void => {
  if (isInitializing && !init) {
    return;
  }

  platform.value = newPlatform;
};

const onSelectProtocol = (newProtocol: Protocol, init = false) => {
  if (isInitializing && !init) {
    return;
  }

  const changed = setProtocol(newProtocol);

  /*
   * Check if rounds are loaded for this protocol.
   * When not initializing, we want to load the latest round.
   */
  if (platform.value && !init) {
    onSelectRound(changed ? round.value : undefined);
  }
};

const onSelectRound = (newRound?: number) => {
  round.value = newRound;
};

// Methods
const updateRouter = async (product: Product, round: number): Promise<void> => {
  const { platform, protocol } = product;

  await router.push({
    name: "rounds-incentives",
    params: { platform, protocol, round },
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

    if (paramRound.value) {
      onSelectRound(paramRound.value);
    }
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

@include dashboardLAF("bribes");

.bribes {
  .dashboard {
    grid-template-rows: 64px 64px auto 1fr;
    grid-template-columns: 1fr 1fr;

    --offset: 0;

    .system-select {
      grid-column: 1 / span 2;
      grid-row: calc(var(--offset) + 1);
    }

    .summary {
      grid-column: 1 / span 2;
      grid-row: calc(var(--offset) + 2);
    }

    .graph-bribes-round {
      grid-column: 1 / span 2;
      grid-row: calc(var(--offset) + 3);
      height: 370px;
    }

    .datatable-bribed {
      grid-column: 1;
    }

    .datatable-personal {
      grid-column: 2;
      grid-row: calc(var(--offset) + 4);
    }
  }
}
</style>
