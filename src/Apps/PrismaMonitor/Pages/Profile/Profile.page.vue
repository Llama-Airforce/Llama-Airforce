<script setup lang="ts">
import { useWallet } from "@/Wallet";
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import TableRedemptions from "@PM/Pages/Profile/Tables/TableRedemptions.vue";
import TableLiquidations from "@PM/Pages/Profile/Tables/TableLiquidations.vue";
import TableTroves from "@PM/Pages/Profile/Tables/TableTroves.vue";
import { TroveOverviewService, type Trove } from "@PM/Services";

// Stores
const storeSettings = useSettingsStore();

// Refs
const router = useRouter();
const { address } = useWallet();

const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");
const vaults = useObservable(prismaService.overview$, []);

const addr = useRouteParams<string>("addr");

const user = ref<string | undefined>(undefined);
const troves = ref<Trove[]>([]);

const trovesUser = computed(() =>
  troves.value
    .filter((x) =>
      user.value
        ? x.owner.toLocaleLowerCase() === user.value.toLocaleLowerCase()
        : false
    )
    .map((x) => x.owner)
);

// Hooks
onMounted(() => {
  if (addr.value) {
    user.value = addr.value;
  }
});

// Methods
const onTroves = (newTroves: Trove[]) => {
  troves.value = newTroves;
};

// Watches
watch(
  address,
  async () => {
    if (!addr.value && !user.value && address.value) {
      await router.push({
        name: "profile",
        params: { addr: address.value },
      });
    }
  },
  { immediate: true }
);

whenever(addr, (addr) => {
  user.value = addr;
});
</script>

<template>
  <div class="dashboard">
    <h2 style="grid-column: 1 / -1; margin-bottom: -0.5rem">
      Profile: {{ user ?? "?" }}
    </h2>

    <TableTroves
      style="z-index: 2"
      :vaults
      :user
      @troves="onTroves"
    ></TableTroves>

    <TableRedemptions :troves="trovesUser"></TableRedemptions>

    <TableLiquidations :troves="trovesUser"></TableLiquidations>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr;
  grid-template-rows: auto;
}
</style>
