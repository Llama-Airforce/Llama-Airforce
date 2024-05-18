<template>
  <div class="properties">
    <DataTable
      class="datatable-properties"
      columns-data="properties-columns-data"
      :show-column-headers="false"
      :rows="properties"
    >
      <template #header-content>
        <div class="title">{{ t("properties") }}</div>
      </template>

      <template #row="{ item: { description, value } }: { item: Row }">
        <div>{{ t(description) }}</div>

        <div v-if="isPrices(value)">
          <AsyncValue
            :value="value.oracle"
            :show-zero="false"
            type="dollar"
          ></AsyncValue>

          /

          <AsyncValue
            :value="value.amm"
            :show-zero="false"
            type="dollar"
          ></AsyncValue>
        </div>

        <div v-else-if="isTokenInfo(value)">
          <div class="token-info">
            <div>{{ value.symbol }}</div>

            <div>
              <a
                class="font-mono"
                :href="linkAddress(value.address)"
                target="_blank"
              >
                {{ value.address }}
              </a>
            </div>

            <div>
              <Button
                icon="fas fa-link"
                @click="clipboard(value.address)"
              ></Button>
            </div>
          </div>
        </div>

        <div v-else>{{ value }}</div>
      </template>
    </DataTable>
  </div>
</template>

<script setup lang="ts">
import { type Market } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
}

const { market } = defineProps<Props>();

// Prices
type Prices = {
  type: "prices";
  oracle: number;
  amm: number;
};
function isPrices(value: unknown): value is Prices {
  return typeof value === "object" && (value as Prices)?.type === "prices";
}
function getPrices(market?: Market): Prices {
  return {
    type: "prices",
    oracle: market?.price_oracle ?? 0,
    amm: market?.amm_price ?? 0,
  };
}

// TokenInfo
type TokenInfo = {
  type: "token";
  symbol: string;
  address: string;
};
function isTokenInfo(value: unknown): value is TokenInfo {
  return typeof value === "object" && (value as TokenInfo)?.type === "token";
}
function getTokenInfo(
  type: "collateral" | "borrowed",
  market?: Market
): TokenInfo {
  if (type === "collateral") {
    return {
      type: "token",
      symbol: market?.collateral_token.symbol ?? "?",
      address: market?.collateral_token?.address?.toLocaleLowerCase() ?? "",
    };
  } else {
    return {
      type: "token",
      symbol: market?.borrowed_token.symbol ?? "?",
      address: market?.borrowed_token?.address?.toLocaleLowerCase() ?? "",
    };
  }
}

// Rows
type Row = { description: string; value: unknown };
const properties = computed(() => [
  {
    description: "oracleamm",
    value: getPrices(market),
  },
  {
    description: "collateral",
    value: getTokenInfo("collateral", market),
  },
  {
    description: "borrowed",
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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-properties {
  height: 100%;

  ::v-deep(.properties-columns-data) {
    display: grid;
    grid-template-columns: 2fr 6fr;
  }

  .token-info {
    display: grid;
    grid-template-columns: 2fr 6fr auto;
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

<i18n lang="yaml" locale="en">
properties: Properties

oracleamm: Oracle / AMM Prices
collateral: Collateral
borrowed: Borrowed
</i18n>
