<script setup lang="ts">
import { addressShort } from "@/Wallet";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <KPI
    class="proposer"
    :label="t('proposer')"
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

<i18n lang="yaml" locale="en">
proposer: Proposer
</i18n>
