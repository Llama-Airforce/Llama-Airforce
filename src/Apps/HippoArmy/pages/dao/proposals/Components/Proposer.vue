<script setup lang="ts">
import type { Proposal } from "@HA/services/dao/schema";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <KPI
    has-value
    class="proposer"
    label="Proposer"
  >
    <a
      target="_blank"
      :href="`https://etherscan.io/address/${proposal.creator}`"
    >
      {{ proposal.creatorEns || addressShort(proposal.creator) }}
    </a>
  </KPI>
</template>
