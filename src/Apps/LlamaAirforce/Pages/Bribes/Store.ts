import { ref } from "vue";
import { defineStore } from "pinia";
import type { Platform, Protocol, Product } from "@LAF/Pages/Bribes/Models";

export const useBribesStore = defineStore("bribesStore", () => {
  const platform = ref<Platform | null>("votium");
  const protocol = ref<Protocol | null>("cvx-crv");

  const product = computed((): Product | null => {
    if (!platform.value || !protocol.value) return null;

    return {
      platform: platform.value,
      protocol: protocol.value,
    };
  });

  return {
    platform,
    protocol,
    product,
  };
});
