<template>
  <Card
    class="addresses"
    :title="t('addresses')"
  >
    <Table
      class="addresses-table"
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
    </Table>
  </Card>
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

.addresses-table {
  --columns-data: 2fr 6fr auto;

  height: 100%;

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
