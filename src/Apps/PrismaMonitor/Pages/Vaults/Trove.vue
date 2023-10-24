<template>
  <div class="trove">
    <ChartTroveRank
      :vault="vault"
      :trove="trove"
    >
    </ChartTroveRank>

    <TableTroveOps
      :vault="vault"
      :trove="trove"
    ></TableTroveOps>
  </div>
</template>

<script setup lang="ts">
// Refs
import { useRoute } from "vue-router";
import { computed, onMounted, watch } from "vue";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";
import ChartTroveRank from "@PM/Pages/Vaults/Charts/ChartTroveRank.vue";
import TableTroveOps from "@PM/Pages/Vaults/Tables/TableTroveOps.vue";
import PrismaService, { type Trove } from "@PM/Services/PrismaService";
import { getHost } from "@/Services/Host";
import { TroveOverviewService } from "@PM/Services/Socket/TroveOverviewService";

const prismaService = new PrismaService(getHost());
const prismaVaultService = new TroveOverviewService("ethereum");

// Refs
const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

const route = useRoute();

const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);
const trove = computed(() => storeVault.trove);

// Hooks
onMounted(async (): Promise<void> => {
  // Fetch trove data here and update the store
  const fetchedTrove: Trove = await prismaService.getTroveDetail(
    "ethereum",
    route.params.vaultAddr as string,
    route.params.troveAddr as string
  );
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
      pathName: "prismavault",
    },
    {
      id: "trove",
      label: `Trove: ${trove.value?.owner ?? "?"}`,
    },
  ];
});

// Watches
watch(prismaVaultService.currentData, (newData) => {
  const vault = newData.find((v) => v.address === vaultAddr.value);
  if (vault) {
    storeVault.vault = vault;
  }
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
      pathName: "prismavault",
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
      pathName: "prismavault",
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
