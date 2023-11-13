<template>
  <div class="trove">
    <ChartTroveRank
      class="graph-rank"
      :vault="vault"
      :trove="trove"
    >
    </ChartTroveRank>

    <ChartTroveHealth
      class="graph-health"
      :vault="vault"
      :trove="trove"
    >
    </ChartTroveHealth>

    <TableTroveOps
      class="table-ops"
      :vault="vault"
      :trove="trove"
    ></TableTroveOps>
  </div>
</template>

<script setup lang="ts">
// Refs
import { useRoute } from "vue-router";
import { computed, onMounted, watch } from "vue";
import { useObservable } from "@/Framework";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { useBreadcrumbStore } from "@PM/Stores/BreadcrumbStore";
import ChartTroveRank from "@PM/Pages/Vaults/Charts/ChartTroveRank.vue";
import ChartTroveHealth from "@PM/Pages/Vaults/Charts/ChartTroveHealth.vue";
import TableTroveOps from "@PM/Pages/Vaults/Tables/TableTroveOps.vue";
import TroveService, { type Trove } from "@PM/Services/TroveService";
import { getHost } from "@/Services/Host";
import { TroveOverviewService } from "@PM/Services/Socket/TroveOverviewService";

const troveService = new TroveService(getHost());
const prismaService = new TroveOverviewService("ethereum");

// Refs
const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

const route = useRoute();

const vaults = useObservable(prismaService.overview$, []);

const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);
const trove = computed(() => storeVault.trove);

// Hooks
onMounted(async (): Promise<void> => {
  // Fetch trove data here and update the store
  const fetchedTrove: Trove = await troveService.getTroveDetail(
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
watch(vaults, (newVaults) => {
  const vault = newVaults.find((v) => v.address === vaultAddr.value);
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

.trove {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: 400px auto;

  .graph-rank {
    grid-row: 1;
    grid-column: 1;
  }

  .graph-health {
    grid-row: 1;
    grid-column: 2;
  }

  .table-ops {
    grid-row: 2;
    grid-column: 1 / -1;
  }
}
</style>
