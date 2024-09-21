<script setup lang="ts">
import { useQueryTransfers } from "@CM/Services/Monitor/Transfer/Queries";

const { data: crvUsdTransfersRaw } = useQueryTransfers(
  ref("0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48")
);
const { relativeTime } = useRelativeTime();

const transferBlocks = computed(() =>
  (crvUsdTransfersRaw.value ?? [])
    .groupBy((x) => x.blockNumber)
    .entries()
    .map(([, txs]) => ({
      blockNumber: txs[0].blockNumber,
      blockUnixTime: txs[0].blockUnixtime,
      amount: txs.reduce((acc, x) => acc + x.parsedAmount, 0),
      count: txs.length,
    }))
    .orderBy((x) => x.blockNumber, "desc")
    .take(5)
);
</script>

<template>
  <div class="dashboard-grid">
    <div class="transfers">
      <div class="title">Latest crvUSD transactions</div>

      <TransitionGroup
        name="transfers"
        tag="div"
        class="transfer-list"
      >
        <Card
          v-for="block of transferBlocks"
          :key="block.blockNumber"
        >
          <div class="card-transfer">
            <div class="block">
              Block
              <a
                class="font-mono"
                :href="`https://etherscan.io/block/${block.blockNumber}`"
                target="_blank"
              >
                {{ block.blockNumber }}
              </a>
            </div>

            <div class="time">
              {{ relativeTime(block.blockUnixTime) }}
            </div>

            <div class="numbers">
              <div class="value">
                <AsyncValue
                  type="dollar"
                  :value="block.amount"
                ></AsyncValue>
              </div>
              <div class="label">crvUSD transfered</div>

              <div class="value">{{ block.count }}</div>
              <div class="label">crvUSD transactions</div>
            </div>
          </div>
        </Card>
      </TransitionGroup>
    </div>
  </div>
</template>

<style scoped>
.dashboard-grid {
  margin: var(--dashboard-gap) 0;

  grid-template-columns: 1fr 1fr 1fr 1fr;
  grid-template-areas: "transfers . . .";

  .transfers {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    .title {
      font-size: 1.5rem;
    }
  }

  .transfer-list {
    display: flex;
    flex-direction: column;
    gap: var(--dashboard-gap);

    .card-transfer {
      display: flex;
      flex-direction: column;
      gap: 0.5ch;

      .block {
        display: flex;
        gap: 1ch;
        align-items: center;
        font-size: 1.25rem;
      }

      .time {
        font-size: 0.865rem;
        font-style: italic;
        margin-bottom: 1ch;
      }

      .numbers {
        display: grid;
        grid-template-columns: minmax(10ch, 1fr) 2fr;

        .value {
          font-weight: bold;
        }
      }
    }
  }
}

.transfers-move, /* apply transition to moving elements */
.transfers-enter-active,
.transfers-leave-active {
  transition: all 0.5s ease;
}

.transfers-enter-from,
.transfers-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

/* ensure leaving items are taken out of layout flow so that moving
   animations can be calculated correctly. */
.transfers-leave-active {
  position: absolute;
}
</style>
