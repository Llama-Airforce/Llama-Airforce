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

<script setup lang="ts">
import { addressShort } from "@/Wallet";
import { type Proposal } from "@CM/Services/Proposal";

const { t } = useI18n();

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();
</script>

<i18n lang="yaml" locale="en">
proposer: Proposer
</i18n>
