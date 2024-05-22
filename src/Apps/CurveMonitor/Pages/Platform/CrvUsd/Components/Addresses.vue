<template>
  <div class="addresses">
    <DataTable
      class="datatable-addresses"
      columns-data="addresses-columns-data"
      :rows="addresses"
    >
      <template #header-content>
        <div class="title">{{ t("addresses") }}</div>
      </template>

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
  </div>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Services/CrvUsd";

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
    address: market?.address,
  },
  {
    description: "factory",
    address: market?.factory,
  },
  {
    description: "llamma",
    address: market?.llamma,
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
  height: 100%;

  ::v-deep(.addresses-columns-data) {
    display: grid;
    grid-template-columns: 2fr 6fr auto;
  }

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
factory: Factory
llamma: Llamma
</i18n>
