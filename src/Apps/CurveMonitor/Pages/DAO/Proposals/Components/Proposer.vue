<script setup lang="ts">
import type { Proposal } from "@curvefi/prices-api/proposal";

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
      :href="`https://etherscan.io/address/${proposal.proposer}`"
    >
      {{ addressShort(proposal.proposer) }}
    </a>
  </KPI>
</template>
