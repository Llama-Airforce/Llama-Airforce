<script setup lang="ts">
type Network = "ethereum" | "arbitrum";

type Contract = {
  contract: string;
  description: string;
  network?: Network;
  gnosis?: boolean;
};

type Bundle = {
  name: string;
  contracts: Contract[];
};

type Repository = {
  name: string;
  url: string;
  description: string;
};

type API = {
  name: string;
  url: string;
  description: string;
};

const vefunder: Bundle = {
  name: "veFunder",
  contracts: [
    {
      contract: veFunderGaugeFactoryAddress,
      description: "Gauge Factory",
    },
    {
      contract: veFunderGaugeController,
      description: "Gauge Controller",
    },
  ],
};

const bundles: Bundle[] = [vefunder];

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "This website's front-end, excluding the Union",
  },
  {
    name: "Phil's CurveMonitor",
    url: "https://github.com/phil-svg/CurveMonitor",
    description: "Phil's code for CurveMonitor",
  },
  {
    name: "Subgraphs",
    url: "https://github.com/convex-community/convex-subgraph",
    description:
      "The Graph subgraphs related to Curve, Convex, Votium and more",
  },
  {
    name: "Tickets",
    url: "https://github.com/orgs/curve-data-analytics/projects",
    description: "Tickets",
  },
];

const apis: API[] = [
  {
    name: "Curve Prices API",
    url: "https://prices.curve.fi/feeds-docs",
    description: "Curve utility API co-developed by CurveMonitor",
  },
  {
    name: "LAF / Curve API (Legacy)",
    url: "https://api-py.llama.airforce/curve/v1/docs",
    description: "Custom analytics API",
  },
];

const linkContract = (contract: Contract): string => {
  switch (contract.network) {
    case "arbitrum":
      return contract.gnosis
        ? `https://app.safe.global/home?safe=arb1:${contract.contract}`
        : `https://arbiscan.io/address/${contract.contract}`;
    case "ethereum":
    case undefined:
    default:
      return contract.gnosis
        ? `https://app.safe.global/home?safe=eth:${contract.contract}`
        : `https://etherscan.io/address/${contract.contract}`;
  }
};
</script>

<template>
  <div class="dashboard">
    <Card title="Repositories">
      <Table
        class="repositories-table"
        title="Yolo"
        :rows="repositories"
        :columns="['Repository', 'Description']"
      >
        <template #row="{ item }">
          <div>
            <a
              target="_blank"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </div>

          <div>{{ item.description }}</div>
        </template>
      </Table>
    </Card>

    <Card title="APIs">
      <Table
        class="apis-table"
        columns-data="apis-columns-data"
        :rows="apis"
        :columns="['API', 'Description']"
      >
        <template #row="{ item }">
          <div>
            <a
              target="_blank"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </div>

          <div>{{ item.description }}</div>
        </template>
      </Table>
    </Card>

    <Card
      v-for="bundle in bundles"
      :key="bundle.name"
      :title="bundle.name"
    >
      <Table
        class="contracts-table"
        columns-header="1fr"
        columns-data="contracts-columns-data"
        :rows="bundle.contracts"
        :columns="['Contract', 'Description']"
      >
        <template #row="{ item }">
          <div>
            <a
              target="_blank"
              :href="linkContract(item)"
            >
              {{ item.contract }}
            </a>
          </div>

          <div>{{ item.description }}</div>
        </template>
      </Table>
    </Card>

    <Card>
      <div class="notices">
        TradingView Lightweight Charts™ Copyright (с) 2023 TradingView, Inc.
        <span>
          <a
            href="https://www.tradingview.com/"
            target="_blank"
          >
            https://www.tradingview.com
          </a>
        </span>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  .contracts-table {
    --columns-data: 3fr 4fr;
  }

  .apis-table {
    --columns-data: 3fr 4fr;
  }

  .repositories-table {
    --columns-data: 2fr 6fr;
  }

  .notices {
    display: flex;
    flex-direction: column;
    gap: 0.75ch;
  }
}
</style>
