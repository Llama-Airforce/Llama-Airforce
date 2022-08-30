import { defineStore } from "pinia";
import type { Epoch } from "@/Pages/Bribes/Models/Epoch";
import type { Overview, OverviewId } from "@/Pages/Bribes/Models/Overview";
import type { Platform } from "@/Pages/Bribes/Models/Platform";
import type { Protocol } from "@/Pages/Bribes/Models/Protocol";
import type { Product } from "@/Pages/Bribes/Models/Product";
import { orderBy } from "lodash";

type ProductState<T> = Record<Platform, Record<Protocol, T>>;
type Rounds = ProductState<number[]>;
type Epochs = ProductState<Epoch[]>;
type Overviews = Record<OverviewId, Overview | null>;

type State = {
  rounds: Rounds;
  epochs: Epochs;
  overviews: Overviews;

  selectedPlatform: Platform | null;
  selectedProtocol: Protocol | null;
  selectedEpoch: Epoch | null;
  selectedOverview: Overview | null;
};

const state: State = {
  rounds: {
    votium: { "cvx-crv": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "aura-bal": [] },
  },
  epochs: {
    votium: { "cvx-crv": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "aura-bal": [] },
  },
  overviews: {
    "bribes-overview-votium": null,
    "bribes-overview-aura": null,
  },

  selectedPlatform: "votium",
  selectedProtocol: "cvx-crv",
  selectedEpoch: null,
  selectedOverview: null,
};

export const useBribesStore = defineStore({
  id: "bribesStore",
  state: (): State => state,
  actions: {
    setRounds(product: Product, rounds: number[]) {
      this.rounds[product.platform][product.protocol] = rounds;
    },
    setEpoch(product: Product, epoch: Epoch) {
      const { platform, protocol } = product;
      this.epochs[platform][protocol] = orderBy(
        [
          // Remove old epoch, add with new instance.
          ...this.epochs[platform][protocol].filter(
            (e) => e.round !== epoch.round
          ),
          epoch,
        ],
        (epoch) => epoch.round,
        "asc"
      );
    },
    setOverview(overview: Overview) {
      this.overviews[overview.id] = overview;
    },
  },
});
