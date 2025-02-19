<script setup lang="ts">
import SelectSystem from "../Components/SelectSystem.vue";
import Summary from "../Components/Summary.vue";
import TableBribed from "../Components/TableBribed.vue";
import TablePersonal from "../Components/TablePersonal.vue";
import ChartBribesRound from "../Components/ChartBribesRound.vue";
import type { Platform, Protocol, Product } from "../Models";
import { isPlatform, isProtocol } from "../Models";
import { useBribesStore } from "../Store";
import AuraBribesService from "../Services/AuraBribesService";
import BribesService from "../Services/BribesService";

let isInitializing = false;

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
      ? new AuraBribesService(useHost())
      : new BribesService(useHost())
);

// Data
const { data: rounds } = useQuery({
  queryKey: ["bribes-rounds", product] as const,
  queryFn: ({ queryKey: [, product] }) => {
    if (product) {
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
    if (product && round) {
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
  (rounds) => {
    if (!round.value) {
      round.value = rounds.at(-1);
    }
  },
  { immediate: true }
);

watch(round, (round) => {
  if (product.value && round) {
    void updateRouter(product.value, round);
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

<template>
  <div class="dashboard">
    <SelectSystem
      style="grid-area: select-system"
      @select-platform="onSelectPlatform"
      @select-protocol="onSelectProtocol"
    />

    <Summary
      style="grid-area: summary"
      :rounds
      :epoch
      @select-round="onSelectRound"
    />

    <ChartBribesRound
      style="grid-area: chart; height: 370px"
      :epoch
    />

    <TablePersonal
      style="grid-area: table-personal; max-height: 750px"
      :epoch
    />

    <TableBribed
      style="grid-area: table-bribed; max-height: 750px"
      :epoch
    />
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr;
  grid-template-areas:
    "select-system select-system"
    "summary summary"
    "chart chart"
    "table-bribed table-personal";
}
</style>
