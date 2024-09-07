<script setup lang="ts">
import { type Market } from "@CM/Services/LlamaLend";

const { market } = defineProps<{
  market: Market | undefined;
}>();

const addresses = computed(() => [
  {
    description: "Controller",
    address: market?.controller,
  },
  {
    description: "Vault",
    address: market?.vault,
  },
  {
    description: "Llamma",
    address: market?.llamma,
  },
  {
    description: "Policy",
    address: market?.policy,
  },
  {
    description: "Oracle",
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

<template>
  <Card
    title="Addresses"
    class="addresses"
  >
    <Table
      class="addresses-table"
      :rows="addresses"
    >
      <template #row="{ item: { description, address } }">
        <div>{{ description }}</div>

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
            v-if="address"
            icon="fas fa-link"
            @click="clipboard(address)"
          ></Button>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style lang="scss" scoped>
.addresses-table {
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
