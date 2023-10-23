<template>
  <div class="troves">
    <TableTroves
      :vault="vault"
      @selected="onTroveSelect"
    ></TableTroves>
  </div>
</template>

<script setup lang="ts">
import {
  type Trove,
} from "@PM/Services/PrismaService";
import { type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";
import TableTroves from "@PM/Pages/Vaults/Tables/TableTroves.vue";
import {useRouter} from "vue-router";
import { useVaultStore } from "@PM/Pages/Vaults/Store";

// Props
interface Props {
  vault: TroveManagerDetails | null;
}

// Refs
const storeVault = useVaultStore();
const router = useRouter();

const { vault } = defineProps<Props>();

// Events
const onTroveSelect = async (trove: Trove) => {
  storeVault.trove = trove;

  if (vault) {
    await router.push({
      name: "prismatrove",
      params: {
        troveAddr: trove.owner,
        vaultAddr: vault.address,
      },
    });
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.troves {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr;
  grid-template-rows: 1fr;
}
</style>
