<script setup lang="ts">
import { useQueryMarketAllUsers } from "@CM/queries/crvusd";
import type { Chain } from "@curvefi/prices-api";
import type { Market } from "@curvefi/prices-api/crvusd";
import TableUsers from "../Tables/TableUsers.vue";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

const controller = computed(() => market?.address);

const { isFetching: loading, data: users } = useQueryMarketAllUsers(
  toRef(() => chain),
  controller
);
</script>

<template>
  <div class="dashboard-grid">
    <TableUsers
      style="grid-area: users"
      :users="users ?? []"
      :chain
      :loading
    />
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-areas: "users";

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
  }
}
</style>
