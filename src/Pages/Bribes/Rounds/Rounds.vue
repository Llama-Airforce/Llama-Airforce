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

<script
  setup
  lang="ts"
>
import { onBeforeMount, onBeforeUnmount } from "vue";
import { $computed } from "vue/macros";
import { useRouter, useRoute } from "vue-router";
import SystemSelect from "@/Pages/Bribes/Components/SystemSelect.vue";
import Summary from "@/Pages/Bribes/Rounds/Components/Summary.vue";
import TableBribed from "@/Pages/Bribes/Rounds/Components/TableBribed.vue";
import TablePersonal from "@/Pages/Bribes/Rounds/Components/TablePersonal.vue";
import GraphBribesRound from "@/Pages/Bribes/Rounds/Components/GraphBribesRound.vue";
import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import BribesService from "@/Pages/Bribes/Services/BribesService";
import { useBribesStore } from "@/Pages/Bribes/Store";
import { isPlatform, Platform } from "@/Pages/Bribes/Models/Platform";
import { isProtocol, Protocol } from "@/Pages/Bribes/Models/Protocol";
import type { Product } from "@/Pages/Bribes/Models/Product";
import { getHost } from "@/Services/Host";

const bribesService = new BribesService(getHost());

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
  const platform = product?.platform;
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
  if ((isInitializing && !init) || !product) {
    return;
  }

  const epoch = await findOrGetEpoch(product, round);
  if (epoch) {
    store.selectedEpoch = epoch;

    void updateRouter(product, epoch);
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
    if (product) {
      onSelectPlatform(product.platform, true);
      await onSelectProtocol(product.protocol, true);
      await onSelectRound(undefined, true);
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

.bribes {
  display: flex;
  justify-content: center;

  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: grid;
    grid-gap: 1.5rem;

    grid-template-rows: 64px 64px auto 1fr;
    grid-template-columns: 1fr 1fr;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

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
