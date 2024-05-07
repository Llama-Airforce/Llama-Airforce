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
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { label } from "@PM/Models/Vault";
import ChartTroveRank from "@PM/Pages/Vaults/Charts/ChartTroveRank.vue";
import ChartTroveHealth from "@PM/Pages/Vaults/Charts/ChartTroveHealth.vue";
import TableTroveOps from "@PM/Pages/Vaults/Tables/TableTroveOps.vue";
import { TroveService, TroveOverviewService, type Trove } from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();
const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

// Services
const troveService = new TroveService(getHost(), storeSettings.flavor);

// Refs
const route = useRoute();

const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
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

  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault.value?.address!) ?? vault.value?.name ?? "?";

  storeBreadcrumb.show = true;
  storeBreadcrumb.crumbs = [
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
watch(vaults, (newVaults) => {
  const vault = newVaults.find((v) => v.address === vaultAddr.value);
  if (vault) {
    storeVault.vault = vault;
  }
});

watch(vault, (newVault) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(newVault?.address!) ?? newVault?.name ?? "?";

  storeBreadcrumb.crumbs = [
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

watch(trove, (newTrove) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault.value?.address!) ?? vault.value?.name ?? "?";

  storeBreadcrumb.crumbs = [
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
