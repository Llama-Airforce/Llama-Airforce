<template>
  <div class="contracts">
    <div class="row">
      <DataTable
        class="datatable-repositories"
        columns-data="repositories-columns-data"
        :rows="repositories"
        :columns="[t('repository'), t('description')]"
      >
        <template #header-title>
          <div>{{ t("repositories") }}</div>
        </template>

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
    </div>

    <DataTable
      v-for="(bundle, i) in bundles"
      :key="i"
      class="datatable-contracts"
      columns-header="1fr"
      columns-data="contracts-columns-data"
      :rows="bundle.contracts"
      :columns="[t('contract'), t('description')]"
    >
      <template #header-title>
        <div>{{ t(bundle.name) }}</div>
      </template>

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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import { DataTable } from "@/Framework";
import {
  MultisigAddress,
  veFunderGaugeFactoryAddress,
  veFunderGaugeController,
  TreasuryAddress,
  TreasuryArbitrumAddress,
} from "@/Util/Addresses";

const { t } = useI18n();

type Network = "ethereum" | "arbitrum";

interface Contract {
  contract: string;
  description: string;
  network?: Network;
  gnosis?: boolean;
}

interface Bundle {
  name: string;
  contracts: Contract[];
}

interface Repository {
  name: string;
  url: string;
  description: string;
}

const union: Bundle = {
  name: "Llama Airforce",
  contracts: [
    {
      contract: MultisigAddress,
      description: "multisig",
      gnosis: true,
    },
    {
      contract: TreasuryAddress,
      description: "treasury",
      gnosis: true,
    },
    {
      contract: TreasuryArbitrumAddress,
      description: "treasury-arbitrum",
      network: "arbitrum",
      gnosis: true,
    },
  ],
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

const bundles: Bundle[] = [union, vefunder];

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "repo-laf",
  },
  {
    name: "Subgraphs",
    url: "https://github.com/convex-community/convex-subgraph",
    description: "repo-graphs",
  },
];

const linkContract = (contract: Contract): string => {
  switch (contract.network) {
    case "arbitrum":
      return contract.gnosis
        ? `https://app.safe.global/arb1:${contract.contract}`
        : `https://arbiscan.io/address/${contract.contract}`;
    case "ethereum":
    default:
      return contract.gnosis
        ? `https://app.safe.global/eth:${contract.contract}`
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

  .row {
    display: flex;
    gap: var(--dashboard-gap);
  }

  .datatable-contracts {
    ::v-deep(.contracts-columns-data) {
      display: grid;
      grid-template-columns: 3fr 4fr;
    }
  }

  .datatable-repositories {
    width: 60%;

    ::v-deep(.repositories-columns-data) {
      display: grid;
      grid-template-columns: 2fr 6fr;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
repositories: Repositories
repository: Repository
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
