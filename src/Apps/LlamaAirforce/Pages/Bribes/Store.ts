import { ref } from "vue";
import { defineStore } from "pinia";
import {
  type Platform,
  type Protocol,
  type Product,
  getProtocols,
} from "@LAF/Pages/Bribes/Models";

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

  function setProtocol(newProtocol: Protocol) {
    const oldProtocol = protocol.value;

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

    return oldProtocol === newProtocol;
  }

  return {
    platform,
    protocol,
    product,

    setProtocol,
  };
});
