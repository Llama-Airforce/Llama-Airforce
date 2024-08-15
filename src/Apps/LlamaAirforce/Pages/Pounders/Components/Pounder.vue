<template>
  <Card
    class="pounder"
    :compact="true"
  >
    <PounderSummary
      :pounder-id="pounderId"
      :expanded="expanded"
      @toggle-expand="expanded = !expanded"
    ></PounderSummary>

    <Collapsible :expanded="expanded">
      <PounderDetails
        :pounder-id="pounderId"
        :expanded="expanded"
      >
      </PounderDetails>
    </Collapsible>
  </Card>
</template>

<script setup lang="ts">
import { useWallet } from "@/Wallet";
import { useUnionStore } from "@Pounders/Store";
import type { PounderId } from "@Pounders/Models";
import PounderSummary from "@Pounders/Components/PounderSummary.vue";
import PounderDetails from "@Pounders/Components/PounderDetails.vue";

// Props
interface Props {
  pounderId: PounderId;
}

const { pounderId } = defineProps<Props>();

// Refs
const { address } = useWallet();
const store = useUnionStore();

const expanded = ref(false);

const pounderStore = computed(() => store.pounders[pounderId]!);
const pounder = computed(() => pounderStore.value.pounder);
const claim = computed(() => store.claims[pounderId]);

// Watches
watch(
  [address, pounder],
  () => store.updateBalances(pounderId, address.value),
  {
    immediate: true,
  }
);

watch(
  claim,
  (claim) => {
    store.updateClaim(pounderId, claim);
  },
  {
    immediate: true,
  }
);

watch(
  pounder,
  async () => {
    await store.updatePounder(pounderId);
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.pounder {
  :deep(.card-body) {
    flex-direction: column;
  }
}
</style>
