<script setup lang="ts">
import { type Proposal } from "@CM/Services/Proposal";
import { capitalize } from "@/Util";

// Props
interface Props {
  proposal: Proposal;
}

const { proposal } = defineProps<Props>();
</script>

<template>
  <KPI
    class="type"
    label="Type"
    :value="capitalize(proposal.type)"
    :has-value="true"
  >
  </KPI>
</template>
