<script setup lang="ts">
import { computed } from "vue";
import { useCirculatingSupply } from "@HA/queries/vesting";

const { data: supply } = useCirculatingSupply();
const theme = useTheme();

const supplyData = computed(() => {
  if (!supply.value) return [];

  return [
    supply.value.circulatingSupply,
    supply.value.permaStaked,
    supply.value.redemptionVesting,
    supply.value.airdropVesting,
    supply.value.treasuryVesting,
    supply.value.licensingVesting,
  ];
});

const supplyLabels = [
  "Circulating Supply",
  "Perma Staked",
  "Redemption Vesting",
  "Airdrop Vesting",
  "Treasury Vesting",
  "Licensing Vesting",
];

const supplyOptions = computed(() => ({
  chart: {
    type: "pie",
    height: 350,
  },
  colors: [
    `${theme.value.colorsArray[0]}88`, // blue
    `${theme.value.colorsArray[2]}88`, // green
    `${theme.value.colorsArray[1]}88`, // yellow
    `${theme.value.colorsArray[3]}88`, // red
    `${theme.value.colorsArray[4]}88`, // purple
    `${theme.value.colorsArray[0]}aa`, // blue variant
  ],
  labels: supplyLabels,
  legend: {
    labels: {
      colors: theme.value.colors.text,
    },
  },
}));
</script>

<template>
  <Card
    ref="supplyCard"
    title="Token Supply Distribution"
  >
    <ChartApex
      :options="supplyOptions"
      :series="supplyData"
    />
  </Card>
</template>
