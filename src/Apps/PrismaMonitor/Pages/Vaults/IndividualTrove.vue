<template>
  <div class="trove">TODO</div>
</template>

<script setup lang="ts">


// Refs
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, watch} from "vue";
import {useVaultStore} from "@PM/Pages/Vaults/Store";
import {useBreadcrumbStore} from "@PM/Stores/BreadcrumbStore";

const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

const route = useRoute();
const router = useRouter();
const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);
const troveAddr = computed(() => route.params.troveAddr as string);
const trove = computed(() => storeVault.trove);

// Hooks
onMounted(() => {


  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vault.value?.name ?? "?"}`,
    },
    {
      id: "trove",
      label: `Trove: ${trove.value?.owner ?? "?"}`,
    },
  ];
});

watch(vault, (newVault) => {
  storeBreadcrumb.crumbs = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${newVault?.name ?? "?"}`,
    },
    {
      id: "trove",
      label: `Trove: ${trove.value?.owner ?? "?"}`,
    },
  ];
});

watch(trove, (newTrove) => {
  storeBreadcrumb.crumbs = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vault.value?.name ?? "?"}`,
    },
    {
      id: "trove",
      label: `Trove: ${newTrove?.owner ?? "?"}`,
    },
  ];
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trove {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
