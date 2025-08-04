<script setup lang="ts">
import type { Block } from "viem";
import { getBlock } from "viem/actions";
import { useClient } from "@wagmi/vue";

const AVG_BLOCK_TIME = 12; // Seconds since proof of stake. We don't care about proof of work era.

const client = useClient();

const dateString = ref<string>("");
const estimatedBlock = ref<Block | undefined>(undefined);
const isLoading = ref<boolean>(false);

const dateObject = computed(() => {
  if (!dateString.value) return undefined;
  const date = new Date(dateString.value);
  return isNaN(date.getTime()) ? undefined : date;
});

async function estimateBlockNumber(date: Date) {
  if (!client.value) return undefined;

  const timestamp = Math.floor(date.getTime() / 1000);

  const { number: latestBlockNumber, timestamp: latestTimestamp } =
    await getBlock(client.value);

  // Estimate block number based on time difference an average block time
  const secondsAgo = Number(latestTimestamp) - timestamp;
  const estimatedBlocksAgo = Math.floor(secondsAgo / AVG_BLOCK_TIME);
  const estimatedBlockNumber = latestBlockNumber - BigInt(estimatedBlocksAgo);

  // Fetch the estimated block
  let bestBlock = await getBlock(client.value, {
    blockNumber: estimatedBlockNumber,
  });
  let bestDiff = Math.abs(Number(bestBlock.timestamp) - timestamp);

  // Check nearby blocks to refine the estimate
  const deltas = [-1000n, -750n, -500n, -250n, 0n, 250n, 500n, 750n, 1000n];

  for (const delta of deltas) {
    const blockNumber = estimatedBlockNumber + delta;
    if (blockNumber < 0n) continue;

    // eslint-disable-next-line no-await-in-loop
    const block = await getBlock(client.value, { blockNumber }).catch(
      () => null
    );
    if (!block) continue;

    const diff = Math.abs(Number(block.timestamp) - timestamp);
    if (diff < bestDiff) {
      bestBlock = block;
      bestDiff = diff;
    }
  }

  return bestBlock;
}

async function onDateInput() {
  if (!dateObject.value) {
    estimatedBlock.value = undefined;
    return;
  }

  isLoading.value = true;
  try {
    estimatedBlock.value = await estimateBlockNumber(dateObject.value);
  } catch {
    estimatedBlock.value = undefined;
  } finally {
    isLoading.value = false;
  }
}
</script>

<template>
  <div class="dashboard">
    <Card>
      <div class="card-block-height">
        <InputText
          v-model="dateString"
          placeholder="Enter date (e.g., 2025-08-02T12:00:00Z)"
          @input="onDateInput"
        />

        <div
          v-if="isLoading"
          class="loading"
        >
          Loading...
        </div>

        <div
          v-else-if="estimatedBlock"
          class="result"
        >
          <h3>Estimated Block</h3>
          <p>Block Number: {{ estimatedBlock.number?.toString() }}</p>
          <p>
            Block Hash:&nbsp;
            <a
              target="_blank"
              :href="`https://etherscan.io/block/${estimatedBlock.hash}`"
            >
              {{ estimatedBlock.hash }}
            </a>
          </p>
          <p>
            Timestamp:
            {{
              new Date(Number(estimatedBlock.timestamp) * 1000).toISOString()
            }}
          </p>
        </div>

        <div
          v-else-if="dateString && !dateObject"
          class="error"
        >
          Invalid date format
        </div>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr;
}

.card-block-height {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result {
  background-color: var(--c-lvl1);
  border-radius: var(--border-radius);

  h3 {
    margin: 0 0 0.5rem 0;
  }

  p {
    margin: 0.25rem 0;
    font-family: monospace;
  }

  .error {
    margin-top: 1rem;
    padding: 1rem;
    background-color: var(--c-red);
    color: white;
    border-radius: var(--border-radius);
  }
}
</style>
