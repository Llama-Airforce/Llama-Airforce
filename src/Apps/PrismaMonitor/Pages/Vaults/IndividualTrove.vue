<template>
  <div class="trove">
    <ChartIndividualTroveRank
      :vault="vault"
      :trove="trove"
    >
    </ChartIndividualTroveRank>
  </div>
</template>

<script setup lang="ts">

// Refs
import {useRoute, useRouter} from "vue-router";
import {computed, onMounted, watch} from "vue";
import {useVaultStore} from "@PM/Pages/Vaults/Store";
import {useBreadcrumbStore} from "@PM/Stores/BreadcrumbStore";
import ChartIndividualTroveRank from "@PM/Pages/Vaults/Charts/ChartIndividualTroveRank.vue";
import PrismaService, {type Trove} from "@PM/Services/PrismaService";
import {getHost} from "@/Services/Host";

const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

const route = useRoute();
const router = useRouter();
const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);
const troveAddr = computed(() => route.params.troveAddr as string);
const trove = computed(() => storeVault.trove);
const prismaService = new PrismaService(getHost());


// Hooks
onMounted(async (): Promise<void> => {
  // Fetch trove data here and update the store
  const fetchedTrove: Trove = await prismaService.getTroveDetail("ethereum", route.params.vaultAddr as string, route.params.troveAddr as string);
  if (fetchedTrove) {
    storeVault.trove = fetchedTrove;
  }

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
      pathName: "prismavault"
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
      pathName: "prismavault"
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
      pathName: "prismavault"
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

@include dashboard("trove");

.trove- {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
