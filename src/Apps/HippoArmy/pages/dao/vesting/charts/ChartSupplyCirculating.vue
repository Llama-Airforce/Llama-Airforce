<script setup lang="ts">
import { computed } from "vue";
import { useCirculatingSupply } from "@HA/queries/vesting";

const { data: supply } = useCirculatingSupply();
const theme = useTheme();

const supplyData = computed(() => {
  if (!supply.value) return [];

  const nonOther = [
    supply.value.cooldownStaked,
    supply.value.effectivePermaStaked,
    supply.value.totalStaked - supply.value.effectivePermaStaked,
    supply.value.lpBalance,
  ];

  return [
    ...nonOther,
    supply.value.circulatingSupply - nonOther.sumBy((x) => x),
  ];
});

const supplyLabels = [
  "Staking cooldown",
  "Perma staked",
  "Normal staked",
  "LP balance",
  "Other",
];

const supplyOptions = computed(() => ({
  chart: {
    type: "pie",
  },
  colors: [
    `${theme.value.colorsArray[0]}88`, // blue
    `${theme.value.colorsArray[2]}88`, // green
    `${theme.value.colorsArray[1]}88`, // yellow
    `${theme.value.colorsArray[3]}88`, // red
    `${theme.value.colorsArray[4]}88`, // purple
  ],
  labels: supplyLabels,
  legend: {
    labels: {
      colors: theme.value.colors.text,
    },
  },
  tooltip: {
    y: {
      formatter: (x: number) => `${round(x, 2, "dollar")}${unit(x)}`,
    },
  },
}));
</script>

<template>
  <Card
    ref="supplyCard"
    title="Token Supply Circulating"
  >
    <ChartApex
      :options="supplyOptions"
      :series="supplyData"
    />
  </Card>
</template>

<style scoped>
.card {
  height: 350px;
}
</style>
