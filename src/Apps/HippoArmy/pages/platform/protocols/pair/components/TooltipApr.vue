<script setup lang="ts">
import type { Pair } from "@HA/services/protocols/schema";

const { pair } = defineProps<{
  pair: Pair;
}>();
</script>

<template>
  <Tooltip>
    <template #trigger>
      <div class="value-tooltip">
        <AsyncValue
          type="percentage"
          :value="pair.aprBase + pair.rewards.sumBy((x) => x.apr)"
          :precision="2"
        />
      </div>
    </template>

    <span class="info">Borrowed reUSD earns: <br /><br /></span>

    <ul class="rewards">
      <li>
        <div>Base APR</div>
        <div>
          <AsyncValue
            type="percentage"
            :value="pair.aprBase"
            :precision="2"
          />
        </div>
      </li>

      <li
        v-for="reward of pair.rewards"
        :key="reward.tokenSymbol"
      >
        <div>{{ reward.tokenSymbol }}</div>
        <div>
          <AsyncValue
            type="percentage"
            :value="reward?.apr"
            :precision="2"
          />
        </div>
      </li>
    </ul>
  </Tooltip>
</template>

<style scoped>
.rewards {
  padding: 0;
  margin: 0;

  li {
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 10ch;
    gap: 0.5rem;

    div:first-child {
      font-weight: bold;
    }

    div:nth-child(2) {
      justify-self: end;
    }
  }
}

:deep(.value-tooltip) {
  .value {
    position: relative;

    &::after {
      content: "";
      position: absolute;
      margin: auto;
      right: 0;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background-color: transparent;
      border-bottom: 2px dotted
        hsl(from var(--c-lvl3) h s calc(l + 12 * var(--color-scheme-dark)));
    }
  }
}
</style>
