import { ref } from "vue";
import { defineStore } from "pinia";
import { orderBy } from "lodash";
import type {
  Epoch,
  Overview,
  OverviewId,
  Platform,
  Protocol,
  Product,
} from "@LAF/Pages/Bribes/Models";

type ProductState<T> = Record<Platform, Record<Protocol, T>>;
type Rounds = ProductState<number[]>;
type Epochs = ProductState<Epoch[]>;
type Overviews = Record<OverviewId, Overview | null>;

export const useBribesStore = defineStore("bribesStore", () => {
  const rounds = ref<Rounds>({
    votium: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
  });

  const epochs = ref<Epochs>({
    votium: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
  });

  const overviews = ref<Overviews>({
    "bribes-overview-votium": null,
    "bribes-overview-prisma": null,
    "bribes-overview-fxn": null,
    "bribes-overview-aura": null,
  });

  const selectedPlatform = ref<Platform | null>("votium");
  const selectedProtocol = ref<Protocol | null>("cvx-crv");
  const selectedEpoch = ref<Epoch | null>(null);
  const selectedOverview = ref<Overview | null>(null);

  function setRounds(product: Product, newRounds: number[]) {
    rounds.value[product.platform][product.protocol] = newRounds;
  }

  function setEpoch(product: Product, epoch: Epoch) {
    const { platform, protocol } = product;
    epochs.value[platform][protocol] = orderBy(
      [
        // Remove old epoch, add with new instance.
        ...epochs.value[platform][protocol].filter(
          (e) => e.round !== epoch.round
        ),
        epoch,
      ],
      (epoch) => epoch.round,
      "asc"
    );
  }

  function setOverview(overview: Overview) {
    overviews.value[overview.id] = overview;
  }

  return {
    rounds,
    epochs,
    overviews,
    selectedPlatform,
    selectedProtocol,
    selectedEpoch,
    selectedOverview,

    setRounds,
    setEpoch,
    setOverview,
  };
});
