<script setup lang="ts">
import type { Trove, TroveManagerDetails } from "@PM/Services";
import TableTroves from "@PM/Pages/Vaults/Tables/TableTroves.vue";
import { useVaultStore } from "@PM/Pages/Vaults/Store";

const { vault } = defineProps<{
  vault: TroveManagerDetails | null;
}>();

// Refs
const storeVault = useVaultStore();
const router = useRouter();

// Events
const onTroveSelect = async (trove: Trove) => {
  storeVault.trove = trove;

  if (vault) {
    await router.push({
      name: "prismatrove",
      params: {
        troveAddr: trove.owner,
        vaultAddr: vault.address,
      },
    });
  }
};
</script>

<template>
  <div class="dashboard-grid">
    <TableTroves
      :vault
      @selected="onTroveSelect"
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;
}
</style>
