<template>
  <div class="contracts">
    <div class="dashboard">
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
  </div>
</template>

<script setup lang="ts">
import { useI18n } from "vue-i18n";
import DataTable from "@/Framework/DataTable.vue";
import {
  DistributorUCrvAddress,
  DistributorUFxsAddress,
  MultisigAddress,
  SnapshotRegistryAddress,
  UnionAddresses,
  UnionCrvVaultAddress,
  ZapsUCrv2Address,
  ZapsUCrvAddress,
  VotiumRegistryAddress,
  UnionFxsVaultAddress,
  ZapsUFxsAddress,
  UFxsStrategyAddress,
  veFunderGaugeFactoryAddress,
  veFunderGaugeController,
  AssetRegistryAddress,
  ZapsUFxsClaimAddress,
  UnionCvxVaultAddress,
  UCvxStrategyAddress,
  PirexCvxAddress,
  PxCvxAddress,
  DistributorUCvxAddress,
  TreasuryAddress,
  TreasuryArbitrumAddress,
  UnionBalVaultAddress,
  UBalStrategyAddress,
  ZapsUBalAddress,
  AuraHandlerAddress,
  BbUsdHandlerAddress,
  ZapsUCvxAddress,
  ZapsUCvxClaimAddress,
  UBalHarvester,
  ZapsUBalAddressOld,
} from "@/Util/Addresses";
import { last } from "lodash";

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
  name: "union",
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
    {
      contract: last(UnionAddresses) || "",
      description: "union-zap",
    },
    {
      contract: UnionAddresses[0],
      description: "union-forward",
    },
  ],
};

const distributors: Bundle = {
  name: "distributors",
  contracts: [
    {
      contract: DistributorUCrvAddress,
      description: "distributor-ucrv",
    },
    {
      contract: DistributorUFxsAddress,
      description: "distributor-ufxs",
    },
    {
      contract: DistributorUCvxAddress,
      description: "distributor-ucvx",
    },
  ],
};

const ucvx: Bundle = {
  name: "uCVX",
  contracts: [
    {
      contract: UnionCvxVaultAddress,
      description: "vault",
    },
    {
      contract: UCvxStrategyAddress,
      description: "strategy",
    },
    {
      contract: ZapsUCvxAddress,
      description: "zaps",
    },
    {
      contract: ZapsUCvxClaimAddress,
      description: "zaps-claim",
    },
  ],
};

const ucrv: Bundle = {
  name: "uCRV",
  contracts: [
    {
      contract: UnionCrvVaultAddress,
      description: "vault",
    },
    {
      contract: ZapsUCrvAddress,
      description: "zaps",
    },
    {
      contract: ZapsUCrv2Address,
      description: "Zaps 2",
    },
  ],
};

const ufxs: Bundle = {
  name: "uFXS",
  contracts: [
    {
      contract: UnionFxsVaultAddress,
      description: "vault",
    },
    {
      contract: UFxsStrategyAddress,
      description: "strategy",
    },
    {
      contract: ZapsUFxsAddress,
      description: "zaps",
    },
    {
      contract: ZapsUFxsClaimAddress,
      description: "zaps-claim",
    },
  ],
};

const ubal: Bundle = {
  name: "uBAL",
  contracts: [
    {
      contract: UnionBalVaultAddress,
      description: "vault",
    },
    {
      contract: UBalStrategyAddress,
      description: "strategy",
    },
    {
      contract: AuraHandlerAddress,
      description: "handler-aura",
    },
    {
      contract: BbUsdHandlerAddress,
      description: "handler-bbusd",
    },
    {
      contract: ZapsUBalAddress,
      description: "zaps",
    },
    {
      contract: UBalHarvester,
      description: "zap-harvester",
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

const registries: Bundle = {
  name: "registries",
  contracts: [
    {
      contract: AssetRegistryAddress,
      description: "registry-union",
    },
    {
      contract: VotiumRegistryAddress,
      description: "registry-votium",
    },
    {
      contract: SnapshotRegistryAddress,
      description: "registry-snapshot",
    },
  ],
};

const pirex: Bundle = {
  name: "Pirex",
  contracts: [
    {
      contract: PirexCvxAddress,
      description: "Pirex",
    },
    {
      contract: PxCvxAddress,
      description: "pxCVX",
    },
  ],
};

const outdated: Bundle = {
  name: "outdated",
  contracts: [
    {
      contract: UnionAddresses[4],
      description: "Union - Zap V5",
    },
    {
      contract: UnionAddresses[3],
      description: "Union - Zap V4",
    },
    {
      contract: UnionAddresses[2],
      description: "Union - Zap V3",
    },
    {
      contract: UnionAddresses[1],
      description: "Union - Zap V2",
    },
    {
      contract: UnionAddresses[0],
      description: "Union - Zap (& Forwarding Address)",
    },
    {
      contract: "0xba5602730824340d714c92a153460db958fd8562",
      description: "Union - Merkle Distributor - uCRV",
    },
    {
      contract: ZapsUBalAddressOld,
      description: "uBAL - Old Zaps",
    },
  ],
};

const bundles: Bundle[] = [
  union,
  distributors,
  ucvx,
  ucrv,
  ufxs,
  ubal,
  vefunder,
  registries,
  pirex,
  outdated,
];

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "repo-laf",
  },
  {
    name: "Union Contracts",
    url: "https://github.com/convex-community/union_contracts",
    description: "repo-union",
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
        ? `https://gnosis-safe.io/app/arb1:${contract.contract}`
        : `https://arbiscan.io/address/${contract.contract}`;
    case "ethereum":
    default:
      return contract.gnosis
        ? `https://gnosis-safe.io/app/eth:${contract.contract}`
        : `https://etherscan.io/address/${contract.contract}`;
  }
};

const { t } = useI18n();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.contracts {
  .dashboard {
    width: 100%;
    padding: $page-margin;

    display: flex;
    flex-direction: column;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    .datatable-contracts {
      grid-column: 1;
      grid-row: 1;
      gap: 0;

      ::v-deep(.contracts-columns-data) {
        display: grid;
        grid-template-columns: 3fr 4fr;
      }
    }

    .datatable-repositories {
      grid-column: 1;
      grid-row: 1;
      margin-bottom: 1.5rem;

      ::v-deep(.repositories-columns-data) {
        display: grid;
        grid-template-columns: 3fr 4fr;
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
repositories: Repositories
repository: Repository
description: Description
contract: Contract

repo-laf: This website's front-end, excluding the Union
repo-union: All deployed Union contracts and tests
repo-graphs: The Graph subgraphs related to Curve, Convex, Votium and more

union: Union
distributors: Distributors
registries: Registries
outdated: Outdated

multisig: Multisig
treasury: Treasury
treasury-arbitrum: Treasury Arbitrum
union-zap: Zap V6
union-forward: Forwarding Address

distributor-ucrv: Merkle Distributor - uCRV
distributor-ufxs: Merkle Distributor - uFXS
distributor-ucvx: Merkle Distributor - uCVX

vault: Vault
strategy: Strategy
zaps: Zaps
zaps-claim: Distributor Claim Zaps
zap-harvester: Bot Harvester Zap

handler-aura: Aura Handler
handler-bbusd: BBUSD Handler

gauge-factory: Gauge Factory
gauge-controller: Gauge Controller

registry-union: Union - Allocation Registry
registry-votium: Votium - Registry
registry-snapshot: Snapshot - Registry
</i18n>
