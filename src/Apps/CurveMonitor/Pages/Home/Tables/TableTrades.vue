<template>
  <Card title="Largest Trades">
    <DataTable
      class="trades-trades"
      :rows="trades"
      :columns="['Tx', 'Name', { label: 'Value', align: 'end' }]"
    >
      <template #row="props: { item: Trade }">
        <div>
          <a
            class="vote-link font-mono"
            :href="`https://etherscan.io/tx/${props.item.tx}`"
            target="_blank"
            @click.stop
          >
            {{ addressShort(props.item.tx) }}
          </a>
        </div>

        <div>{{ props.item.name }}</div>

        <div class="end">
          <AsyncValue
            :value="props.item.value"
            :precision="2"
            type="dollar"
          />
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Trade } from "@CM/Services/Protocol";
import { useQueryTradesLarge } from "@CM/Services/Protocol/Queries";

// Data
const { data: trades } = useQueryTradesLarge();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.trades-trades {
  --columns-data: 6rem 1fr auto;
}
</style>
