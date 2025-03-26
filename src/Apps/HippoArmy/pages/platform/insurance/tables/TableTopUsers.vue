<script setup lang="ts">
import type { TopUser } from "@HA/services/insurance/schema";

const { topUsers } = defineProps<{
  topUsers: TopUser[];
}>();
</script>

<template>
  <Card title="Top Users">
    <Table
      :rows="topUsers"
      :columns="['Address', { label: 'Staked reUSD', align: 'end' }]"
    >
      <template #row="{ item: topUser }">
        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${topUser.address}`"
            @click.stop
          >
            {{ topUser.ens || addressShort(topUser.address) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="topUser.positionValue"
            :precision="2"
            :show-symbol="false"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 6rem 1fr;
}
</style>
