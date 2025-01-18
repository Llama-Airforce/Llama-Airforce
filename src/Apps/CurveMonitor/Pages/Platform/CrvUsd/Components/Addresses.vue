<script setup lang="ts">
import type { Market } from "@CM/Services/crvusd";

const { market } = defineProps<{
  market: Market | undefined;
}>();

const addresses = computed(() => [
  {
    description: "Controller",
    address: market?.address,
  },
  {
    description: "Factory",
    address: market?.factory,
  },
  {
    description: "Llamma",
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

<template>
  <Card
    class="addresses"
    title="Addresses"
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
            target="_blank"
            :href="linkAddress(address)"
          >
            {{ address }}
          </a>
          <span v-else>?</span>
        </div>

        <div>
          <Button
            v-if="address"
            @click="clipboard(address)"
          >
            <LucideLink />
          </Button>
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
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
