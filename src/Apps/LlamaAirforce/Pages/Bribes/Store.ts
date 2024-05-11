import { ref } from "vue";
import { defineStore } from "pinia";
import { orderBy } from "lodash";
import type {
  Epoch,
  Platform,
  Protocol,
  Product,
} from "@LAF/Pages/Bribes/Models";

type ProductState<T> = Record<Platform, Record<Protocol, T>>;
type Rounds = ProductState<number[]>;
type Epochs = ProductState<Epoch[]>;

export const useBribesStore = defineStore("bribesStore", () => {
  const rounds = ref<Rounds>({
    votium: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
  });

  const epochs = ref<Epochs>({
    votium: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
    hh: { "cvx-crv": [], "cvx-prisma": [], "cvx-fxn": [], "aura-bal": [] },
  });

  const platform = ref<Platform | null>("votium");
  const protocol = ref<Protocol | null>("cvx-crv");
  const epoch = ref<Epoch | null>(null);

  const product = computed((): Product | null => {
    if (!platform.value || !protocol.value) return null;

    return {
      platform: platform.value,
      protocol: protocol.value,
    };
  });

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

  return {
    rounds,
    epochs,
    platform,
    protocol,
    product,
    epoch,

    setRounds,
    setEpoch,
  };
});
