<script setup lang="ts">
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { TroveOverviewService } from "@PM/Services";
import { label } from "@PM/Models/Vault";
import VaultOverview from "@PM/Pages/Vaults/Tabs/VaultOverview.vue";
import Collateral from "@PM/Pages/Vaults/Tabs/Collateral.vue";
import Liquidations from "@PM/Pages/Vaults/Tabs/Liquidations.vue";
import Redemptions from "@PM/Pages/Vaults/Tabs/Redemptions.vue";
import Troves from "@PM/Pages/Vaults/Tabs/Troves.vue";

// Stores
const storeSettings = useSettingsStore();
const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

// Refs
const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);

const vaultAddr = useRouteParams<string>("vaultAddr");
const vault = computed(() => storeVault.vault);

// Hooks
onMounted(() => {
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
    },
  ];
});

// Watches
watch(vaults, (vaults) => {
  const vault = vaults.find((v) => v.address === vaultAddr.value);

  if (vault) {
    storeVault.vault = vault;
  }
});

watch(vault, (vault) => {
  // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
  const vaultLabel = label(vault?.address!) ?? vault?.name ?? "?";

  storeBreadcrumb.crumbs = [
    {
      id: "vaults",
      label: "Vaults",
      pathName: "vaults",
    },
    {
      id: "vault",
      label: `Vault: ${vaultLabel}`,
    },
  ];
});

// Tabs
const { tabActive, tabActiveIndex } = useTabNavigation(
  ["overview", "collateral", "trove", "liquidations", "redemptions"],
  "prismavault",
  () => ({
    vaultAddr: vaultAddr.value,
  })
);
</script>

<template>
  <div class="vault-manager">
    <TabView
      :active="tabActiveIndex"
      @tab="tabActiveIndex = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <VaultOverview
            v-if="tabActive === 'overview'"
            :vault="vault"
          ></VaultOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Collateral">
        <KeepAlive>
          <Collateral
            v-if="tabActive === 'collateral' && vault"
            :vault="vault"
          ></Collateral>
        </KeepAlive>
      </TabItem>

      <TabItem header="Troves">
        <KeepAlive>
          <Troves
            v-if="tabActive === 'trove' && vault"
            :vault="vault"
          ></Troves>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 'liquidations' && vault"
            :vault="vault"
          ></Liquidations>
        </KeepAlive>
      </TabItem>

      <TabItem header="Redemptions">
        <KeepAlive>
          <Redemptions
            v-if="tabActive === 'redemptions' && vault"
            :vault="vault"
          ></Redemptions>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("vault-manager");

.vault-manager {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
