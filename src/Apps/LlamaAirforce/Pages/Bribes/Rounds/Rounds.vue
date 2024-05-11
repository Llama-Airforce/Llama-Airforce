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
        @select-round="onSelectRound"
      ></Summary>

      <GraphBribesRound class="graph-bribes-round"></GraphBribesRound>
      <TablePersonal class="datatable-personal"></TablePersonal>
      <TableBribed class="datatable-bribed"></TableBribed>
    </div>
  </div>
</template>

<script setup lang="ts">
import SystemSelect from "@LAF/Pages/Bribes/Components/SystemSelect.vue";
import Summary from "@LAF/Pages/Bribes/Rounds/Components/Summary.vue";
import TableBribed from "@LAF/Pages/Bribes/Rounds/Components/TableBribed.vue";
import TablePersonal from "@LAF/Pages/Bribes/Rounds/Components/TablePersonal.vue";
import GraphBribesRound from "@LAF/Pages/Bribes/Rounds/Components/GraphBribesRound.vue";
import type {
  Epoch,
  Platform,
  Protocol,
  Product,
} from "@LAF/Pages/Bribes/Models";
import { getProtocols, isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import AuraBribesService from "@LAF/Pages/Bribes/Services/AuraBribesService";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";

let isInitializing = false;

// Refs
const storeBribe = useBribesStore();
const { epoch, epochs, platform, protocol, product } = storeToRefs(storeBribe);
const { setEpoch } = storeBribe;

const router = useRouter();
const route = useRoute();

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

// Hooks.
onBeforeMount(async (): Promise<void> => {
  await initFromRouter();
});

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

const onSelectProtocol = async (
  newProtocol: Protocol,
  init = false
): Promise<void> => {
  if (isInitializing && !init) {
    return;
  }

  if (platform.value) {
    const platformProtocols = getProtocols(platform.value);

    if (platformProtocols.includes(newProtocol)) {
      // platform includes current protocol, keep platform, update protocol
      protocol.value = newProtocol;
    } else {
      if (protocol.value === newProtocol) {
        // no protocol change, change platform, override selected protocol to first of arr
        protocol.value = platformProtocols[0];
      } else {
        // update protocol, flip platform
        protocol.value = newProtocol;
        platform.value = platform.value === "hh" ? "votium" : "hh";
      }
    }
  } else {
    protocol.value = newProtocol;
  }

  // Check if rounds are loaded for this protocol.
  if (platform.value) {
    // When not initializing, we want to load the latest round.
    if (!init) {
      await onSelectRound();
    }
  }
};

/** Gets the epoch for a given platform, protocol and optional round. */
const findOrGetEpoch = async (
  product: Product,
  round?: number // Find latest if null.
): Promise<Epoch | null> => {
  const { platform, protocol } = product;
  let epochFound: Epoch | null = null;

  // Given a round, check if it's already loaded, otherwise try to fetch it.
  if (round) {
    const epochState = epochs.value[platform][protocol].find(
      (epoch) => epoch.round === round
    );

    if (epochState) {
      return epochState;
    }

    const epochResp = await bribesService.value.getEpoch({
      platform,
      protocol,
      round,
    });

    if (epochResp.epoch) {
      epochFound = epochResp.epoch;
    }
  }

  // If no round was given, check if there's a 'last one' loaded.
  if (!round) {
    const epochLast = epochs.value[platform][protocol].at(-1);

    if (epochLast) {
      return epochLast;
    }
  }

  // If finally no epoch was returned, fetch the latest one instead.
  if (!epochFound) {
    const { epoch: epochLatest } = await bribesService.value.getEpoch({
      platform,
      protocol,
    });

    if (epochLatest) {
      epochFound = epochLatest;
    }
  }

  if (epochFound) {
    setEpoch({ platform, protocol }, epochFound);
  }

  return epochFound ?? null;
};

const onSelectRound = async (round?: number, init = false): Promise<void> => {
  if ((isInitializing && !init) || !product.value) {
    return;
  }

  const newEpoch = await findOrGetEpoch(product.value, round);

  if (newEpoch) {
    epoch.value = newEpoch;

    void updateRouter(product.value, newEpoch);
  }
};

// Methods
const updateRouter = async (product: Product, epoch: Epoch): Promise<void> => {
  const { platform, protocol } = product;

  await router.push({
    name: "rounds-incentives",
    params: { platform, protocol, round: epoch.round },
  });
};

const initFromRouter = async (): Promise<void> => {
  if (isInitializing) {
    return;
  }
  isInitializing = true;

  const paramRound = route.params.round;
  const paramPlatform = route.params.platform;
  const paramProtocol = route.params.protocol;

  if (
    paramRound &&
    typeof paramRound === "string" &&
    paramPlatform &&
    typeof paramPlatform === "string" &&
    isPlatform(paramPlatform) &&
    paramProtocol &&
    typeof paramProtocol === "string" &&
    isProtocol(paramProtocol)
  ) {
    onSelectPlatform(paramPlatform, true);
    await onSelectProtocol(paramProtocol, true);

    const round = parseInt(paramRound, 10);

    if (round) {
      await onSelectRound(round, true);
    }
  } else {
    // Default to default product.
    if (product.value) {
      onSelectPlatform(product.value.platform, true);
      await onSelectProtocol(product.value.protocol, true);
      await onSelectRound(undefined, true);
    }
  }

  isInitializing = false;
};
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
