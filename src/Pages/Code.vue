<template>
  <div class="contracts">
    <div class="dashboard">
      <DataTable
        v-for="(bundle, i) in bundles"
        :key="i"
        class="datatable-contracts"
        columns-header="1fr"
        columns-data="contracts-columns-data"
        :rows="bundle.contracts"
        :columns="['Contract', 'Description']"
      >
        <template #header-title>
          <div>{{ bundle.name }}</div>
        </template>

        <template #row="props: { item: Contract }">
          <div>
            <a
              :href="link(props.item)"
              target="_blank"
            >
              {{ props.item.contract }}
            </a>
          </div>

          <div>{{ props.item.description }}</div>
        </template>
      </DataTable>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
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
} from "@/Util/Addresses";
import { last } from "lodash";

type Network = "ethereum" | "arbitrum";

interface Contract {
  contract: string;
  description: string;
  network?: Network;
}

interface Bundle {
  name: string;
  contracts: Contract[];
}

const union: Bundle = {
  name: "Union",
  contracts: [
    {
      contract: MultisigAddress,
      description: "Multisig",
    },
    {
      contract: TreasuryAddress,
      description: "Treasury",
    },
    {
      contract: TreasuryArbitrumAddress,
      description: "Treasury Arbitrum",
      network: "arbitrum",
    },
    {
      contract: last(UnionAddresses) || "",
      description: "Zap V6",
    },
    {
      contract: UnionAddresses[0],
      description: "Forwarding Address",
    },
  ],
};

const distributors: Bundle = {
  name: "Distributors",
  contracts: [
    {
      contract: DistributorUCrvAddress,
      description: "Merkle Distributor - uCRV",
    },
    {
      contract: DistributorUFxsAddress,
      description: "Merkle Distributor - uFXS",
    },
    {
      contract: DistributorUCvxAddress,
      description: "Merkle Distributor - uCVX",
    },
  ],
};

const ucvx: Bundle = {
  name: "uCVX",
  contracts: [
    {
      contract: UnionCvxVaultAddress,
      description: "Vault",
    },
    {
      contract: UCvxStrategyAddress,
      description: "Strategy",
    },
  ],
};

const ucrv: Bundle = {
  name: "uCRV",
  contracts: [
    {
      contract: UnionCrvVaultAddress,
      description: "Vault",
    },
    {
      contract: ZapsUCrvAddress,
      description: "Zaps",
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
      description: "Vault",
    },
    {
      contract: UFxsStrategyAddress,
      description: "Strategy",
    },
    {
      contract: ZapsUFxsAddress,
      description: "Zaps",
    },
    {
      contract: ZapsUFxsClaimAddress,
      description: "Distributor Claim Zaps",
    },
  ],
};

const ubal: Bundle = {
  name: "uBAL",
  contracts: [
    {
      contract: UnionBalVaultAddress,
      description: "Vault",
    },
    {
      contract: UBalStrategyAddress,
      description: "Strategy",
    },
    {
      contract: AuraHandlerAddress,
      description: "Aura Handler",
    },
    {
      contract: BbUsdHandlerAddress,
      description: "BBUSD Handler",
    },
    {
      contract: ZapsUBalAddress,
      description: "Zaps",
    },
  ],
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

const registries: Bundle = {
  name: "Registries",
  contracts: [
    {
      contract: AssetRegistryAddress,
      description: "Union - Allocation Registry",
    },
    {
      contract: VotiumRegistryAddress,
      description: "Votium - Registry",
    },
    {
      contract: SnapshotRegistryAddress,
      description: "Snapshot - Registry",
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
  name: "Outdated",
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

const link = (contract: Contract): string => {
  switch (contract.network) {
    case "arbitrum":
      return `https://arbiscan.io/address/${contract.contract}`;
    case "ethereum":
    default:
      return `https://etherscan.io/address/${contract.contract}`;
  }
};
</script>

<style
  lang="scss"
  scoped
>
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

      ::v-deep(.contracts-columns-data) {
        display: grid;
        grid-template-columns: 1fr 1fr;
      }
    }
  }
}
</style>
