<template>
  <div class="contracts">
    <Card :title="t('repositories')">
      <DataTable
        class="repositories-table"
        :rows="repositories"
        :columns="[t('repository'), t('description')]"
        title="Yolo"
      >
        <template #row="props: { item: Repository }">
          <div>
            <a
              :href="props.item.url"
              target="_blank"
            >
              {{ props.item.name }}
            </a>
          </div>

          <div>{{ t(props.item.description) }}</div>
        </template>
      </DataTable>
    </Card>

    <Card :title="t('apis')">
      <DataTable
        class="apis-table"
        columns-data="apis-columns-data"
        :rows="apis"
        :columns="[t('api'), t('description')]"
      >
        <template #row="props: { item: API }">
          <div>
            <a
              :href="props.item.url"
              target="_blank"
            >
              {{ props.item.name }}
            </a>
          </div>

          <div>{{ t(props.item.description) }}</div>
        </template>
      </DataTable>
    </Card>

    <Card
      v-for="(bundle, i) in bundles"
      :key="i"
      :title="t(bundle.name)"
    >
      <DataTable
        class="contracts-table"
        columns-header="1fr"
        columns-data="contracts-columns-data"
        :rows="bundle.contracts"
        :columns="[t('contract'), t('description')]"
      >
        <template #row="props: { item: Contract }">
          <div>
            <a
              :href="linkContract(props.item)"
              target="_blank"
            >
              {{ props.item.contract }}
            </a>
          </div>

          <div>{{ t(props.item.description) }}</div>
        </template>
      </DataTable>
    </Card>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

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
      description: "gauge-factory",
    },
    {
      contract: veFunderGaugeController,
      description: "gauge-controller",
    },
  ],
};

const bundles: Bundle[] = [vefunder];

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "repo-laf",
  },
  {
    name: "Phil's CurveMonitor",
    url: "https://github.com/phil-svg/CurveMonitor",
    description: "Phil's code for CurveMonitor",
  },
  {
    name: "Subgraphs",
    url: "https://github.com/convex-community/convex-subgraph",
    description: "repo-graphs",
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
    default:
      return contract.gnosis
        ? `https://app.safe.global/home?safe=eth:${contract.contract}`
        : `https://etherscan.io/address/${contract.contract}`;
  }
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("contracts");

.contracts {
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
}
</style>

<i18n lang="yaml" locale="en">
repositories: Repositories
repository: Repository
apis: APIs
api: API
description: Description
contract: Contract
other: Other

repo-laf: This website's front-end, excluding the Union
repo-graphs: The Graph subgraphs related to Curve, Convex, Votium and more

multisig: Multisig
treasury: Treasury
treasury-arbitrum: Treasury Arbitrum

gauge-factory: Gauge Factory
gauge-controller: Gauge Controller
</i18n>
