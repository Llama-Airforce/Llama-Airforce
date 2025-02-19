<!-- eslint-disable @typescript-eslint/no-unnecessary-condition -->
<script setup lang="ts">
import type { Chain } from "@curvefi/prices-api";
import type { Market } from "@curvefi/prices-api/llamalend";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

const collateral = computed(() => ({
  type: "token",
  symbol: market?.collateralToken?.symbol ?? "?",
  address: market?.collateralToken?.address ?? "?",
}));

const borrowed = computed(() => ({
  type: "token",
  symbol: market?.borrowedToken?.symbol ?? "?",
  address: market?.borrowedToken?.address ?? "?",
}));

const linkAddress = (addr: string) => `https://etherscan.io/address/${addr}`;

const clipboard = async (addr: string) => {
  await navigator.clipboard.writeText(addr);
};
</script>

<template>
  <Card
    class="properties"
    title="Properties"
  >
    <Table class="properties-table">
      <TableRow>
        <div>Collateral</div>
        <div class="token-info">
          <TokenIcon
            :chain
            :address="collateral.address"
          />

          <div>{{ collateral.symbol }}</div>

          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="linkAddress(collateral.address)"
            >
              {{ collateral.address }}
            </a>
          </div>

          <div>
            <Button @click="clipboard(collateral.address)">
              <LucideLink />
            </Button>
          </div>
        </div>
      </TableRow>

      <TableRow>
        <div>Borrowed</div>
        <div class="token-info">
          <TokenIcon
            :chain
            :address="borrowed.address"
          />

          <div>{{ borrowed.symbol }}</div>

          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="linkAddress(borrowed.address)"
            >
              {{ borrowed.address }}
            </a>
          </div>

          <div>
            <Button @click="clipboard(borrowed.address)">
              <LucideLink />
            </Button>
          </div>
        </div>
      </TableRow>
    </Table>
  </Card>
</template>

<style scoped>
.properties-table {
  --columns-data: 2fr 6fr;

  .token-info {
    display: grid;
    gap: 1ch;
    grid-template-columns: 26px 2fr 8fr auto;
    justify-content: space-between;
    align-items: center;
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
