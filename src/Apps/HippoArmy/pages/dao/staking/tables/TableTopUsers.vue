<script setup lang="ts">
import type { TopUser } from "@HA/services/staking/schema";

const { topUsers } = defineProps<{
  topUsers: TopUser[];
}>();
</script>

<template>
  <Card title="Top Users">
    <Table
      :rows="topUsers"
      :columns="[
        'Address',
        { label: 'RSUP', align: 'end' },
        { label: 'Dollars', align: 'end' },
      ]"
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

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="topUser.positionValueUsd"
            :precision="2"
          />
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: minmax(8rem, 1fr) minmax(4rem, 8rem) minmax(4rem, 8rem);
}
</style>
