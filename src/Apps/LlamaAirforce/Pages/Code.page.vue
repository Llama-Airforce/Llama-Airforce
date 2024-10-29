<script setup lang="ts">
type Network = "ethereum" | "arbitrum" | "base";

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

type Other = {
  name: string;
  url: string;
  description: string;
};

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
      contract: TreasuryBaseAddress,
      description: "treasury-base",
      network: "base",
      gnosis: true,
    },
    {
      contract: UnionAddresses.at(-1) ?? "",
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
    {
      contract: DistributorUPrismaAddress,
      description: "distributor-uprisma",
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
    {
      contract: ZapsUCvxPirexClaimsAddress,
      description: "Pirex Claims Distributor Zap",
    },
    {
      contract: PirexMultisigAddress,
      description: "Pirex Multisig",
      gnosis: true,
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
      contract: UCrvStrategyAddress,
      description: "strategy",
    },
    {
      contract: UCrvHarvester,
      description: "zap-harvester",
    },
    {
      contract: ZapsUCrvAddress,
      description: "zaps",
    },
    {
      contract: ZapsUCrvClaimAddress,
      description: "zaps-claim",
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
      contract: UFxsHarvester,
      description: "zap-harvester",
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

const uprisma: Bundle = {
  name: "uPRISMA",
  contracts: [
    {
      contract: UnionPrismaVaultAddress,
      description: "vault",
    },
    {
      contract: UPrismaStrategyAddress,
      description: "strategy",
    },
    {
      contract: UPrismaHarvester,
      description: "zap-harvester",
    },
    {
      contract: ZapsUPrismaAddress,
      description: "zaps",
    },
    {
      contract: ZapsUPrismaClaimAddress,
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

const bundles: Bundle[] = [
  union,
  distributors,
  ucvx,
  ucrv,
  ufxs,
  uprisma,
  ubal,
  registries,
  pirex,
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

const other: Other[] = [
  {
    name: "haowi.eth",
    url: "https://twitter.com/HaowiWang",
    description: "Translation: Chinese / 中文",
  },
];

const linkContract = (contract: Contract): string => {
  switch (contract.network) {
    case "arbitrum":
      return contract.gnosis
        ? `https://app.safe.global/home?safe=arb1:${contract.contract}`
        : `https://arbiscan.io/address/${contract.contract}`;
    case "base":
      return contract.gnosis
        ? `https://app.safe.global/home?safe=base:${contract.contract}`
        : `https://basescan.org/address/${contract.contract}`;
    case "ethereum":
    case undefined:
    default:
      return contract.gnosis
        ? `https://app.safe.global/home?safe=eth:${contract.contract}`
        : `https://etherscan.io/address/${contract.contract}`;
  }
};

const { t } = useI18n();
</script>

<template>
  <div class="dashboard">
    <Card
      class="repositories-card"
      :title="t('repositories')"
    >
      <Table
        class="repositories-table"
        :rows="repositories"
        :columns="[t('repository'), t('description')]"
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

          <div>{{ t(item.description) }}</div>
        </template>
      </Table>
    </Card>

    <Card
      class="other-card"
      :title="t('other')"
    >
      <Table
        class="other-table"
        :rows="other"
        :columns="[t('other'), t('description')]"
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

          <div>{{ t(item.description) }}</div>
        </template>
      </Table>
    </Card>

    <Card
      v-for="bundle in bundles"
      :key="bundle.name"
      class="contracts-card"
      :title="t(bundle.name)"
    >
      <Table
        class="contracts-table"
        :rows="bundle.contracts"
        :columns="[t('contract'), t('description')]"
      >
        <template #row="{ item }">
          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="linkContract(item)"
            >
              {{ item.contract }}
            </a>
          </div>

          <div>{{ t(item.description) }}</div>
        </template>
      </Table>
    </Card>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 6fr 4fr;

  .contracts-card {
    grid-column: 1 / -1;

    .contracts-table {
      --columns-data: 3fr 4fr;
    }
  }

  .repositories-card {
    grid-column: 1;

    .repositories-table {
      --columns-data: 2fr 6fr;
    }
  }

  .other-card {
    grid-column: 2;

    .other-table {
      --columns-data: 3fr 4fr;
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
repo-union: All deployed Union contracts and tests
repo-graphs: The Graph subgraphs related to Curve, Convex, Votium and more

union: Union
distributors: Distributors
registries: Registries

multisig: Multisig
treasury: Treasury
treasury-arbitrum: Treasury Arbitrum
treasury-base: Treasury Base
union-zap: Zap V9
union-forward: Forwarding Address

distributor-ucrv: Merkle Distributor - uCRV
distributor-ufxs: Merkle Distributor - uFXS
distributor-ucvx: Merkle Distributor - uCVX
distributor-uprisma: Merkle Distributor - uPRISMA

vault: Vault
strategy: Strategy
zaps: Zaps
zaps-claim: Distributor Claim Zaps
zap-harvester: Harvester

handler-aura: Aura Handler
handler-bbusd: BBUSD Handler

registry-union: Union - Allocation Registry
registry-votium: Votium - Registry
registry-snapshot: Snapshot - Registry
</i18n>
