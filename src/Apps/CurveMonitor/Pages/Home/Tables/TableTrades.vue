<template>
  <DataTable
    class="datatable-trades"
    columns-header="1fr"
    columns-data="trades-columns-data"
    :rows="trades"
    :columns="['Tx', 'Name', 'Value']"
  >
    <template #header-content>
      <div class="title">Largest Trades</div>
    </template>

    <template #row="props: { item: Trade }">
      <div>
        <a
          class="vote-link"
          :href="`https://etherscan.io/tx/${props.item.tx}`"
          target="_blank"
          @click.stop
        >
          {{ addressShort(props.item.tx) }}
        </a>
      </div>

      <div>{{ props.item.name }}</div>

      <div class="number">
        <AsyncValue
          :value="props.item.value"
          :precision="2"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
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

.datatable-trades {
  :deep(.trades-columns-data) {
    grid-template-columns: 6rem 1fr auto;

    div:nth-child(1) {
      font-family: var(--font-mono);
    }

    // Right adjust number columns.
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>
