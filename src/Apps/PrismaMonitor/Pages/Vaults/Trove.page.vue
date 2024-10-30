<script setup lang="ts">
// Refs
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { label } from "@PM/Models/Vault";
import ChartTroveRank from "@PM/Pages/Vaults/Charts/ChartTroveRank.vue";
import ChartTroveHealth from "@PM/Pages/Vaults/Charts/ChartTroveHealth.vue";
import TableTroveOps from "@PM/Pages/Vaults/Tables/TableTroveOps.vue";
import { TroveService, TroveOverviewService, type Trove } from "@PM/Services";

const { flavor } = storeToRefs(useSettingsStore());
const { crumbs } = storeToRefs(useBreadcrumbStore());
const { vault, trove } = storeToRefs(useVaultStore());

const troveService = new TroveService(flavor.value);

const socket = useSocketStore().getSocket(getApiSocket(flavor.value));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);

const vaultAddr = useRouteParams<string>("vaultAddr");
const troveAddr = useRouteParams<string>("troveAddr");

// Hooks
onMounted(async (): Promise<void> => {
  // Fetch trove data here and update the store
  const fetchedTrove: Trove = await troveService.getTroveDetail(
    "ethereum",
    vaultAddr.value,
    troveAddr.value
  );

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (fetchedTrove) {
    trove.value = fetchedTrove;
  }

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault.value?.address!) ?? vault.value?.name ?? "?";

  crumbs.value = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vaultLabel}`,
      pathName: "prismavault",
    },
    {
      id: "trove",
      label: `Trove: ${trove.value?.owner ?? "?"}`,
    },
  ];
});

// Watches
watch(vaults, (vaults) => {
  const newVault = vaults.find((v) => v.address === vaultAddr.value);

  if (newVault) {
    vault.value = newVault;
  }
});

watch(vault, (vault) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault?.address!) ?? vault?.name ?? "?";

  crumbs.value = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vaultLabel}`,
      pathName: "prismavault",
    },
    {
      id: "trove",
      label: `Trove: ${trove.value?.owner ?? "?"}`,
    },
  ];
});

watch(trove, (trove) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault.value?.address!) ?? vault.value?.name ?? "?";

  crumbs.value = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vaultLabel}`,
      pathName: "prismavault",
    },
    {
      id: "trove",
      label: `Trove: ${trove?.owner ?? "?"}`,
    },
  ];
});
</script>

<template>
  <div class="dashboard">
    <ChartTroveRank
      class="graph-rank"
      :vault
      :trove
    />

    <ChartTroveHealth
      class="graph-health"
      :vault
      :trove
    />

    <TableTroveOps
      class="table-ops"
      :vault
      :trove
    />
  </div>
</template>

<style scoped>
.dashboard {
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
