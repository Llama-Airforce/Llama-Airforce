<template>
  <div class="liquidations"></div>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Pages/Platform/LlamaLend/Models/Market";

// Props
interface Props {
  market: Market | null;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const { market } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.liquidations {
  margin: var(--dashboard-gap) 0;

  @include dashboard-grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;
}
</style>
