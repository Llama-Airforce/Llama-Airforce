import { type TroveManagerDetails, type Trove } from "@PM/Services";

export const useVaultStore = defineStore("vaultStore", () => {
  const vault = ref<TroveManagerDetails | null>(null);
  const trove = ref<Trove | null>(null);

  return {
    vault,
    trove,
  };
});
