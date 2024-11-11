<script setup lang="ts">
import { addressShort } from "@/Utils/Wallet";
import type { Proposal } from "@PM/Pages/Proposals/Models/Proposal";

const { t } = useI18n();

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
</script>

<template>
  <KPI
    has-value
    class="proposer"
    :label="t('proposer')"
  >
    <a
      target="_blank"
      :href="`https://etherscan.io/address/${proposal.proposer}`"
    >
      {{ addressShort(proposal.proposer) }}
    </a>
  </KPI>
</template>

<i18n lang="yaml" locale="en">
proposer: Proposer
</i18n>
