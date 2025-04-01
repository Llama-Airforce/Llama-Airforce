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
      :columns="['Address', { label: 'Position value', align: 'end' }]"
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
          <AsyncValue :value="topUser.positionValue" />
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
