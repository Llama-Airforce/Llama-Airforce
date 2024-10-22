<script setup lang="ts">
import { type Chain } from "@CM/Models";
import { type Market } from "@CM/Services/LlamaLend";

const { market, chain } = defineProps<{
  market: Market | undefined;
  chain: Chain | undefined;
}>();

// TokenInfo
type TokenInfo = {
  type: "token";
  symbol: string;
  address: string;
};

function isTokenInfo(value: unknown): value is TokenInfo {
  return (
    typeof value === "object" && (value as { type: string }).type === "token"
  );
}

function getTokenInfo(
  type: "collateral" | "borrowed",
  market?: Market
): TokenInfo {
  if (!market) {
    return {
      type: "token",
      symbol: "?",
      address: "?",
    };
  }

  if (type === "collateral") {
    return {
      type: "token",
      symbol: market.collateral_token.symbol,
      address: market.collateral_token.address,
    };
  } else {
    return {
      type: "token",
      symbol: market.borrowed_token.symbol,
      address: market.borrowed_token.address,
    };
  }
}

// Rows
const properties = computed(() => [
  {
    description: "Collateral",
    value: getTokenInfo("collateral", market),
  },
  {
    description: "Borrowed",
    value: getTokenInfo("borrowed", market),
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
    class="properties"
    title="Properties"
  >
    <Table
      class="properties-table"
      :rows="properties"
    >
      <template #row="{ item: { description, value } }">
        <div>{{ description }}</div>

        <div v-if="isTokenInfo(value)">
          <div class="token-info">
            <TokenIcon
              :chain
              :address="value.address"
            />

            <div>{{ value.symbol }}</div>

            <div>
              <a
                class="font-mono"
                target="_blank"
                :href="linkAddress(value.address)"
              >
                {{ value.address }}
              </a>
            </div>

            <div>
              <Button @click="clipboard(value.address)">
                <LucideLink />
              </Button>
            </div>
          </div>
        </div>

        <div v-else>{{ value }}</div>
      </template>
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
