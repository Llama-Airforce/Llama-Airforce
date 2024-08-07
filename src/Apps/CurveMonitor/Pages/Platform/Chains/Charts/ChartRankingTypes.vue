<template>
  <CardChart
    class="chart"
    :title
    :options="options"
    :series="series"
  >
    <template #actions>
      <div class="actions">
        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        ></Legend>
      </div>
    </template>
  </CardChart>
</template>

<script setup lang="ts">
import { chain as chain_, capitalize } from "lodash";
import { createChartStyles } from "@/Styles/ChartStyles";
import { useSettingsStore } from "@CM/Stores";
import type { Activity } from "@CM/Services/Chains";

type ActivityValue = Omit<Activity, "timestamp"> & {
  value: number;
};

const { t } = useI18n();

// Props
interface Props {
  chain: ActivityValue["chain"] | "all";
  txs: ActivityValue[];
  users: ActivityValue[];
}

const { chain, txs, users } = defineProps<Props>();

const { theme } = storeToRefs(useSettingsStore());

const title = computed(
  () => `${t("title")} (${chain === "all" ? "All Chains" : capitalize(chain)})`
);

// Legend
const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow } = theme.value.colors;
  return [
    { id: "txs", label: t("txs"), color: blue, togglable: true },
    { id: "users", label: t("users"), color: yellow, togglable: true },
  ];
});

// Chart
function getData(xs: ActivityValue[]) {
  return chain_(xs)
    .groupBy((x) => x.type)
    .mapValues((xs, type) => {
      const sum = xs.reduce((acc, x) => acc + x.value, 0);

      return {
        type: type as ActivityValue["type"],
        count: sum,
      };
    })
    .values()
    .orderBy((x) => x.count, "desc")
    .value();
}

const options = computed(() => {
  const { colors } = theme.value;

  return createChartStyles(theme.value, {
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

const categories = computed((): string[] =>
  chain_(dataTxs.value)
    .concat(dataUsers.value)
    .orderBy((x) => x.count, "desc")
    .map((x) => x.type)
    .uniq()
    .value()
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
const formatterX = (x: string): string => x;
const formatterY = (x: number): string =>
  `${round(x, 0, "dollar")}${unit(x, "dollar")}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.cart-chart {
  :deep(.card-body) {
    .chart {
      height: 300px;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Top Types
txs: Transactions
users: Users
</i18n>
