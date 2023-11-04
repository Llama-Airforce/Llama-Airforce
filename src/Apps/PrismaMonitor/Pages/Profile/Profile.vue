<template>
  <div class="profile">
    <h2 style="grid-column: 1 / -1; margin-bottom: -0.5rem">
      Profile: {{ user ?? "?" }}
    </h2>

    <TableTroves
      style="z-index: 2"
      :vaults="vaults"
      :user="user"
      @troves="onTroves"
    ></TableTroves>

    <TableRedemptions :troves="trovesUser"></TableRedemptions>

    <TableLiquidations :troves="trovesUser"></TableLiquidations>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, onMounted, computed } from "vue";
import { useRoute, useRouter } from "vue-router";
import { useWalletStore } from "@/Wallet";
import TableRedemptions from "@PM/Pages/Profile/Tables/TableRedemptions.vue";
import TableLiquidations from "@PM/Pages/Profile/Tables/TableLiquidations.vue";
import TableTroves from "@PM/Pages/Profile/Tables/TableTroves.vue";
import {
  TroveOverviewService,
  type TroveManagerDetails,
} from "@PM/Services/Socket/TroveOverviewService";
import { type Trove } from "@PM/Services/PrismaService";

const prismaService = new TroveOverviewService("ethereum");

// Refs
const route = useRoute();
const router = useRouter();
const wallet = useWalletStore();

const user = ref<string | undefined>(undefined);
const vaults = ref<TroveManagerDetails[]>([]);
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

// Watches
watch(prismaService.currentData, (newData) => {
  vaults.value = newData;
});

// Hooks
onMounted(() => {
  vaults.value = prismaService.currentData.value;

  const addrParam = route.params.addr;
  if (addrParam && typeof addrParam === "string") {
    user.value = addrParam;
  }
});

// Methods
const onTroves = (newTroves: Trove[]) => {
  troves.value = newTroves;
};

// Watches
watch(
  () => wallet.address,
  async () => {
    if (!route.params.addr && !user.value && wallet.address) {
      await router.push({
        name: "profile",
        params: { addr: wallet.address },
      });
    }
  },
  { immediate: true }
);

watch(
  () => route.params,
  () => {
    const addrParam = route.params.addr;
    if (addrParam && typeof addrParam === "string") {
      user.value = addrParam;
    }
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("profile");

.mkusd {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 1fr 1fr;
  grid-template-rows: auto;
}
</style>
