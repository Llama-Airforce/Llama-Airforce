<script setup lang="ts">
import PounderDetails from "@Pounders/Components/PounderDetails.vue";
import PounderSummary from "@Pounders/Components/PounderSummary.vue";
import type { PounderId } from "@Pounders/Models";
import { useUnionStore } from "@Pounders/Store";

const { pounderId } = defineProps<{
  pounderId: PounderId;
}>();

const { address } = useAccount();
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

<template>
  <Card
    compact
    class="pounder"
  >
    <PounderSummary
      :pounder-id
      :expanded
      @toggle-expand="expanded = !expanded"
    />

    <Collapsible :expanded>
      <PounderDetails
        :pounder-id
        :expanded
      />
    </Collapsible>
  </Card>
</template>
