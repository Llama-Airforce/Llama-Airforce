<template>
  <Card
    :title="t('addresses')"
    class="addresses"
  >
    <DataTable
      class="datatable-addresses"
      :rows="addresses"
    >
      <template #row="{ item: { description, address } }: { item: Row }">
        <div>{{ t(description) }}</div>

        <div>
          <a
            v-if="address"
            class="font-mono"
            :href="linkAddress(address)"
            target="_blank"
          >
            {{ address }}
          </a>
          <span v-else>?</span>
        </div>

        <div>
          <Button
            icon="fas fa-link"
            @click="clipboard(address)"
          ></Button>
        </div>
      </template>
    </DataTable>
  </Card>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

type Row = { description: string; address: string };
const addresses = computed(() => [
  {
    description: "controller",
    address: market?.controller,
  },
  {
    description: "vault",
    address: market?.vault,
  },
  {
    description: "llamma",
    address: market?.llamma,
  },
  {
    description: "policy",
    address: market?.policy,
  },
  {
    description: "oracle",
    address: market?.oracle,
  },
]);

const linkAddress = (addr: string): string => {
  return `https://etherscan.io/address/${addr}`;
};

const clipboard = async (addr: string) => {
  await navigator.clipboard.writeText(addr);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-addresses {
  --columns-data: 2fr 6fr auto;

  button {
    background: transparent;

    &:hover,
    &:active {
      background: transparent;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description: Description
address: Address
addresses: Addresses

controller: Controller
vault: Vault
llamma: Llamma
policy: Policy
oracle: Oracle
</i18n>
