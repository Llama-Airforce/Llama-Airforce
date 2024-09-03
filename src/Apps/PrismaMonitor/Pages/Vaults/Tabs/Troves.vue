<script setup lang="ts">
import { type Trove, type TroveManagerDetails } from "@PM/Services";
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
  <div class="troves">
    <TableTroves
      :vault="vault"
      @selected="onTroveSelect"
    ></TableTroves>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.troves {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
