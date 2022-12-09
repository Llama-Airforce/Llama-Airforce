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
import { useI18n } from "vue-i18n";
import KPI from "@/Framework/KPI.vue";
import type { Proposal } from "@/Pages/Curve/DAO/Proposals/Models/Proposal";
import { addressShort } from "@/Wallet/WalletHelper";

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
