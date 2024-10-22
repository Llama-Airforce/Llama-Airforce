<script setup lang="ts">
import { capitalize } from "@/Util";
import { createChartStyles } from "@/Styles/ChartStylesApex";
import type { Activity } from "@CM/Services/Chains";

type ActivityValue = Omit<Activity, "timestamp"> & {
  value: number;
};

const { chain, txs, users } = defineProps<{
  chain: ActivityValue["chain"] | "all";
  txs: ActivityValue[];
  users: ActivityValue[];
}>();

const theme = useTheme();

const title = computed(
  () => `Top Types (${chain === "all" ? "All Chains" : capitalize(chain)})`
);

// Legend
const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow } = theme.value.colors;
  return [
    { id: "txs", label: "Transactions", color: blue, togglable: true },
    { id: "users", label: "Users", color: yellow, togglable: true },
  ];
});

// Chart
function getData(xs: ActivityValue[]) {
  return xs
    .groupBy((x) => x.type)
    .entries()
    .map(([type, xs]) => {
      const sum = xs.reduce((acc, x) => acc + x.value, 0);

      return {
        type: type as ActivityValue["type"],
        count: sum,
      };
    })
    .orderBy((x) => x.count, "desc");
}

const options = computed(() => {
  const { colors } = theme.value;

  return createChartStyles({
    chart: {
      type: "bar",
      animations: {
        enabled: false,
      },
    },
    colors: [colors.blue, colors.yellow],
    xaxis: {
      categories: categories.value,
      labels: {
        formatter: formatterX,
      },
    },
    yaxis: {
      labels: {
        formatter: formatterY,
      },
    },
    legend: {
      show: false,
    },
    dataLabels: {
      enabled: false,
    },
    tooltip: {
      enabled: false,
    },
  });
});

const dataTxs = computed(() => (toggles.txs.value ? getData(txs) : []));
const dataUsers = computed(() => (toggles.users.value ? getData(users) : []));

const categories = computed(() =>
  dataTxs.value
    .concat(dataUsers.value)
    .orderBy((x) => x.count, "desc")
    .map((x) => x.type)
    .uniq()
);

const series = computed((): { data: number[] }[] => {
  const txsData = categories.value.map((type) => {
    const item = dataTxs.value.find((x) => x.type === type);
    return item ? item.count : 0;
  });

  const usersData = categories.value.map((type) => {
    const item = dataUsers.value.find((x) => x.type === type);
    return item ? item.count : 0;
  });

  return [
    { data: toggles.txs.value ? txsData : [] },
    { data: toggles.users.value ? usersData : [] },
  ];
});

// Methods
const formatterX = (x: string) => x;
const formatterY = (x: number) => `${round(x, 0, "dollar")}${unit(x)}`;
</script>

<template>
  <Card :title>
    <template #actions-secondary>
      <Legend
        :items
        :disabled
        @toggle="toggles[$event].value = !toggles[$event].value"
      />
    </template>

    <ChartApex
      :options
      :series
    />
  </Card>
</template>

<style scoped>
.chart {
  height: 300px;
}
</style>
