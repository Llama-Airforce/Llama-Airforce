<script setup lang="ts">
import type { TopUsersResponse } from "@HA/services/savings/schema";

const { topUsers } = defineProps<{ topUsers: TopUsersResponse["users"] }>();
</script>

<template>
  <Card title="Top Holders">
    <Table :rows="topUsers" :columns="['Address', { label: 'Assets', align: 'end' }, { label: '%', align: 'end' }]">
      <template #row="{ item: u }">
        <div>
          <a target="_blank" :href="`https://etherscan.io/address/${u.address}`" @click.stop>{{ u.ens || addressShort(u.address) }}</a>
        </div>
        <div class="end">
          <AsyncValue :value="u.currentAssets" :precision="2" :show-symbol="false" />
        </div>
        <div class="end">
          <AsyncValue :value="u.percentage" :precision="2" type="percentage" />
        </div>
      </template>
    </Table>
  </Card>
  
</template>

<style scoped>
.table { --columns-data: minmax(8rem, 1fr) minmax(4rem, 8rem) 6rem; }
</style>
