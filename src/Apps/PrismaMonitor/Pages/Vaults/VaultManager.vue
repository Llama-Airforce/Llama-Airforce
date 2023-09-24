<template>
  <div class="vault-overview">
    <TabView
      :active="tabActive"
      @tab="tabActive = $event.index"
    >
      <TabItem header="Overview">
        <KeepAlive>
          <MarketOverview v-if="tabActive === 0" :vault="vault"></MarketOverview>
        </KeepAlive>
      </TabItem>

      <TabItem header="Liquidations">
        <KeepAlive>
          <Liquidations v-if="tabActive === 1 && vault" :vault="vault"></Liquidations>
        </KeepAlive>
      </TabItem>

      <TabItem header="Llamma">
        <KeepAlive>
          <Llamma v-if="tabActive === 2 && vault" :vault="vault"></Llamma>
        </KeepAlive>
      </TabItem>
    </TabView>
  </div>
</template>

<script setup lang="ts">
import {computed, onMounted, ref, watch} from "vue";
import {useRoute, useRouter} from "vue-router";
import { TabView, TabItem } from "@/Framework";
import { useBreadcrumbStore } from "@CM/Stores/BreadcrumbStore";
import { useVaultStore } from "@PM/Pages/Vaults/Store";
import {TroveOverviewService} from "@PM/Services/Socket/TroveOverviewService";

const prismaService = new TroveOverviewService("ethereum");

// Refs
const route = useRoute();
const router = useRouter();

const storeBreadcrumb = useBreadcrumbStore();
const storeVault = useVaultStore();
const tabActive = ref(0);

const vaultAddr = computed(() => route.params.vaultAddr as string);
const vault = computed(() => storeVault.vault);

// Hooks
onMounted(async () => {

  const tabParam = route.params.tab;
  if (tabParam && typeof tabParam === "string") {
    if (tabParam === "liquidations") {
      tabActive.value = 1;
    }
    else if (tabParam === "llamma") {
      tabActive.value = 2;
    }
  }

  watch(prismaService.currentData, (newData) => {
    const vault = newData.find(v => v.address === vaultAddr.value);
    if (vault) {
      storeVault.vault = vault;
    }
  });

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
  ];

});

// Watches
watch(tabActive, async (newTab) => {
  if (newTab === 0) {
    await router.push({ name: "prismavault", params: { tab: "", vaultAddr: vaultAddr.value } });
  } else if (newTab === 1) {
    await router.push({ name: "prismavault", params: { tab: "liquidations", vaultAddr: vaultAddr.value } });
  }else if (newTab === 2) {
    await router.push({ name: "prismavault", params: { tab: "llamma", vaultAddr: vaultAddr.value } });
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.vault-overview {
  padding-top: 2rem;
  position: relative;
  display: grid;
}
</style>
