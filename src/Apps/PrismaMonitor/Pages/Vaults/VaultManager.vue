<template>
  <div class="vault-manager">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <VaultOverview
            v-if="tabActive === 0"
            :vault="vault"
          ></VaultOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Collateral">
        <KeepAlive>
          <Collateral
            v-if="tabActive === 1 && vault"
            :vault="vault"
          ></Collateral>
        </KeepAlive>
      </TabItem>

      <TabItem header="Troves">
        <KeepAlive>
          <Troves
            v-if="tabActive === 2 && vault"
            :vault="vault"
          ></Troves>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations
            v-if="tabActive === 3 && vault"
            :vault="vault"
          ></Liquidations>
        </KeepAlive>
      </TabItem>

      <TabItem header="Redemptions">
        <KeepAlive>
          <Redemptions
            v-if="tabActive === 4 && vault"
            :vault="vault"
          ></Redemptions>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import { TroveOverviewService } from "@PM/Services";
import { label } from "@PM/Models/Vault";
import VaultOverview from "@PM/Pages/Vaults/VaultOverview.vue";
import Collateral from "@PM/Pages/Vaults/Collateral.vue";
import Liquidations from "@PM/Pages/Vaults/Liquidations.vue";
import Redemptions from "@PM/Pages/Vaults/Redemptions.vue";
import Troves from "@PM/Pages/Vaults/Troves.vue";

// Stores
const storeSettings = useSettingsStore();
const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();

// Refs
const route = useRoute();
const router = useRouter();

const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);

const tabActive = ref(0);

const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);

// Hooks
onMounted(() => {
  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "collateral") {
      tabActive.value = 1;
    } else if (tabParam === "trove") {
      tabActive.value = 2;
    } else if (tabParam === "liquidations") {
      tabActive.value = 3;
    } else if (tabParam === "redemptions") {
      tabActive.value = 4;
    }
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
    },
  ];
});

watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({
      name: "prismavault",
      params: { tab: "", vaultAddr: vaultAddr.value },
    });
  } else if (newTab === 1) {
    await router.push({
      name: "prismavault",
      params: { tab: "collateral", vaultAddr: vaultAddr.value },
    });
  } else if (newTab === 2) {
    await router.push({
      name: "prismavault",
      params: { tab: "trove", vaultAddr: vaultAddr.value },
    });
  } else if (newTab === 3) {
    await router.push({
      name: "prismavault",
      params: { tab: "liquidations", vaultAddr: vaultAddr.value },
    });
  } else if (newTab === 4) {
    await router.push({
      name: "prismavault",
      params: { tab: "redemptions", vaultAddr: vaultAddr.value },
    });
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("vault-manager");

.vault-manager {
  position: relative;
  max-width: calc(1920px - 18.125rem);
}
</style>
