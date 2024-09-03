<script setup lang="ts">
import { type Proposal } from "@CM/Services/Proposal";
import { capitalize } from "@/Util";

const { proposal } = defineProps<{
  proposal: Proposal;
}>();
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
