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
        @select-round="onSelectRound"
      ></Summary>

      <GraphBribesRound class="graph-bribes-round"></GraphBribesRound>
      <TablePersonal class="datatable-personal"></TablePersonal>
      <TableBribed class="datatable-bribed"></TableBribed>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeMount, onBeforeUnmount } from "vue";
import { useRouter, useRoute } from "vue-router";
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
import { isPlatform, isProtocol } from "@LAF/Pages/Bribes/Models";
import BribesService from "@LAF/Pages/Bribes/Services/BribesService";
import { useBribesStore } from "@LAF/Pages/Bribes/Store";
import { getHost } from "@/Services/Host";

const bribesService = new BribesService(getHost());

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

// Hooks.
onBeforeMount(async (): Promise<void> => {
  await initFromRouter();
});

onBeforeUnmount((): void => {
  isInitializing = false;
});

// Events
/** Gets all rounds for a given product and fetches if necessary. */
const getRounds = async (product: Product): Promise<number[]> => {
  const { platform, protocol } = product;

  let rounds = store.rounds[platform][protocol];
  if (rounds && rounds.length > 0) {
    return rounds;
  }

  rounds = await bribesService
    .rounds({ platform, protocol })
    .then((x) => x.rounds);

  store.setRounds({ platform, protocol }, rounds);

  return rounds;
};

// Events
const onSelectPlatform = (platform: Platform, init = false): void => {
  if (isInitializing && !init) {
    return;
  }

  store.selectedPlatform = platform;
};

const onSelectProtocol = async (
  protocol: Protocol,
  init = false
): Promise<void> => {
  if (isInitializing && !init) {
    return;
  }

  store.selectedProtocol = protocol;

  // Check if rounds are loaded for this protocol.
  const platform = product.value?.platform;
  if (platform) {
    await getRounds({ platform, protocol });

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
    const epochState = store.epochs[platform][protocol].find(
      (epoch) => epoch.round === round
    );

    if (epochState) {
      return epochState;
    }

    const epochResp = await bribesService.getEpoch({
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
    const epochLast = store.epochs[platform][protocol].at(-1);

    if (epochLast) {
      return epochLast;
    }
  }

  // If finally no epoch was returned, fetch the latest one instead.
  if (!epochFound) {
    const { epoch: epochLatest } = await bribesService.getEpoch({
      platform,
      protocol,
    });

    if (epochLatest) {
      epochFound = epochLatest;
    }
  }

  if (epochFound) {
    store.setEpoch({ platform, protocol }, epochFound);
  }

  return epochFound ?? null;
};

const onSelectRound = async (round?: number, init = false): Promise<void> => {
  if ((isInitializing && !init) || !product.value) {
    return;
  }

  const epoch = await findOrGetEpoch(product.value, round);
  if (epoch) {
    store.selectedEpoch = epoch;

    void updateRouter(product.value, epoch);
  }
};

// Methods
const updateRouter = async (product: Product, epoch: Epoch): Promise<void> => {
  const { platform, protocol } = product;

  await router.push({
    name: "rounds",
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

    .system-select {
      grid-column: 1 / span 2;
      grid-row: 1;
    }

    .summary {
      grid-column: 1 / span 2;
      grid-row: 2;
    }

    .graph-bribes-round {
      grid-column: 1 / span 2;
      grid-row: 3;
      height: 370px;
    }

    .datatable-bribed {
      grid-column: 1;
      grid-row: 4;
    }

    .datatable-personal {
      grid-column: 2;
      grid-row: 4;
    }
  }
}
</style>
