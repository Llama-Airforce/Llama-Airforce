<script setup lang="ts">
import type { TroveManagerDetails } from "@PM/Services";
import ChartOpenTroves from "@PM/Pages/Vaults/Charts/ChartOpenTroves.vue";
import ChartCollateralRatio from "@PM/Pages/Vaults/Charts/ChartCollateralRatio.vue";
import ChartRatioDeciles from "@PM/Pages/Vaults/Charts/ChartRatioDeciles.vue";
import ChartGlobalCollateral from "@PM/Pages/Vaults/Charts/ChartGlobalCollateral.vue";
import TableVaults from "@PM/Pages/Vaults/Tables/TableVaults.vue";
import { useVaultStore } from "@PM/Pages/Vaults/Store";

// Crumbs
const { crumbs } = storeToRefs(useBreadcrumbStore());
crumbs.value = [
  {
    id: "vaults",
    label: "Vaults",
    pathName: "vaults",
  },
];

// Vault selection
const { vault } = storeToRefs(useVaultStore());
const router = useRouter();

const onVaultSelect = async (newVault: TroveManagerDetails) => {
  vault.value = newVault;

  await router.push({
    name: "prismavault",
    params: {
      tab: "",
      vaultAddr: newVault.address,
    },
  });
};
</script>

<template>
  <div class="dashboard">
    <TableVaults
      style="grid-column: 1 / -1"
      @selected="onVaultSelect"
    />

    <ChartCollateralRatio />
    <ChartRatioDeciles />
    <ChartGlobalCollateral />
    <ChartOpenTroves />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto 1fr 1fr;
}
</style>
