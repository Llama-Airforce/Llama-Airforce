<script setup lang="ts">
import { useQueryOracles } from "@CM/queries/oracles";

const { isFetching: loading, data } = useQueryOracles();

const { relativeTime } = useRelativeTime();

async function copy(value: string) {
  notify({ text: `Copied ${value}`, type: "success", duration: 5000 });
  await navigator.clipboard.writeText(value);
}
</script>

<template>
  <Card
    title="Oracles"
    :loading
  >
    <template #actions>
      Last Recorded Block: {{ data?.lastRecordedBlock }}
    </template>

    <Table
      :loading
      :rows="data?.oracles ?? []"
      :columns="[
        'Chain',
        'Address',
        { label: 'Last Block', align: 'end' },
        'Block Hash',
        'Parent Hash',
        'State Root',
        { label: 'Time', align: 'end' },
      ]"
    >
      <template
        #row="{
          item: {
            chain,
            address,
            lastConfirmedBlockNumber,
            blockHeader: { hashBlock, hashParent, stateRoot, timestamp },
          },
        }"
      >
        <div class="icon">
          <ChainIcon :chain />
          {{ chain }}
        </div>

        <div>
          <a @click="copy(address)">{{ addressShort(address, 12) }}</a>
        </div>

        <div class="end">{{ lastConfirmedBlockNumber }}</div>

        <div>
          <a @click="copy(hashBlock)">{{ addressShort(hashBlock, 12) }}</a>
        </div>

        <div>
          <a @click="copy(hashParent)">{{ addressShort(hashParent, 12) }}</a>
        </div>

        <div>
          <a @click="copy(stateRoot)">{{ addressShort(stateRoot, 12) }}</a>
        </div>

        <div class="end">
          {{ relativeTime(timestamp.getUTCTimestamp()) }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: 10rem minmax(12ch, 1fr) 5rem 1fr 1fr 1fr 6rem;
}

a:hover {
  cursor: pointer;
}

.icon {
  display: flex;
  align-items: center;
  gap: 2ch;
  text-transform: capitalize;

  img {
    width: 26px;
  }
}
</style>
