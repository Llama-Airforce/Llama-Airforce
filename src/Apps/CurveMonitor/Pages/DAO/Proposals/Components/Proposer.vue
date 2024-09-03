<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Proposal } from "@CM/Services/Proposal";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <KPI
    class="proposer"
    label="Proposer"
    :has-value="true"
  >
    <a
      :href="`https://etherscan.io/address/${proposal.proposer}`"
      target="_blank"
    >
      {{ addressShort(proposal.proposer) }}
    </a>
  </KPI>
</template>
