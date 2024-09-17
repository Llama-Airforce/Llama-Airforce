<script setup lang="ts">
const emit = defineEmits<{
  close: [];
}>();

const linkCurve = "https://t.me/curve_monitor_backup";
const linkCrvUsd = "https://t.me/crvUSD_community_bot";

function go(url: string) {
  window.open(url, "_blank");
}
</script>

<template>
  <Modal @close="emit('close')">
    <div class="telegram-body">
      <Card
        class="border-special-hover"
        title="Curve Monitor"
        @click.prevent="go(linkCurve)"
      >
        <template #actions>
          <a :href="linkCurve">{{ linkCurve }}</a>
        </template>

        <div class="item crvUSD">
          This Telegram channel provides real-time updates on crvUSD
          transactions, including loan activity, collateral movements, peg
          maintenance, and major asset swaps on the Ethereum blockchain. It's a
          valuable resource for staying informed about crvUSD market dynamics
          and related metrics.
        </div>
      </Card>

      <Card
        class="border-special-hover"
        title="crvUSD"
        @click.prevent="go(linkCrvUsd)"
      >
        <template #actions>
          <a :href="linkCrvUsd">{{ linkCrvUsd }}</a>
        </template>

        <div class="item crvUSD">
          Health Monitoring bot for Curve LlamaLend positions:

          <ul>
            <li>/add <em>address</em> - Add an Ethereum address</li>
            <li>/remove <em>address</em> - Remove an Ethereum address</li>
            <li>/list - List all your Ethereum addresses</li>
            <li>/removeAll - Remove all your Ethereum addresses</li>
            <li>/gib - Prints all your health stats</li>
            <li>/help - Show help message and some QoL commands</li>
          </ul>
        </div>
      </Card>
    </div>
  </Modal>
</template>

<style scoped>
emph {
  color: var(--c-lvl6);
}

.telegram-body {
  max-width: 60vw;

  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: calc(2 * var(--dashboard-gap));

  font-size: 1rem;

  @media only screen and (max-width: 1280px) {
    max-width: 80vw;
    overflow-y: auto;
    max-height: 80dvh;

    grid-template-columns: 1fr;
    gap: calc(0.5 * var(--dashboard-gap));
  }

  .item {
    display: flex;
    flex-direction: column;
    gap: 1rem;

    width: 100%;
    overflow-y: auto;
    user-select: none;
  }

  ul {
    display: flex;
    flex-direction: column;

    margin-block-start: 0;
    margin-block-end: 0;
    padding-inline-start: 0rem;

    li {
      text-wrap: pretty;
      margin: 0.25rem 2rem;
      list-style-type: square;

      &::marker {
        color: var(--c-primary);
      }
    }
  }

  .card {
    --padding: 6px;

    margin: calc(2 * var(--padding));
  }
}
</style>
