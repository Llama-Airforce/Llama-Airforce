<template>
  <div class="properties">
    <DataTable
      class="datatable-properties"
      columns-data="properties-columns-data"
      :rows="properties"
    >
      <template #header-content>
        <div class="title">{{ t("properties") }}</div>
      </template>

      <template #row="{ item: { description, value } }: { item: Row }">
        <div>{{ t(description) }}</div>

        <div v-if="isTokenInfo(value)">
          <div class="token-info">
            <TokenIcon
              :chain
              :address="value.address"
            ></TokenIcon>

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
import { type Chain } from "@CM/Models/Chain";
import { type Market } from "@CM/Services/CrvUsd";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
  chain: Chain | undefined;
}

const { market, chain } = defineProps<Props>();

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
      address: market?.collateral_token?.address ?? "",
    };
  } else {
    return {
      type: "token",
      symbol: market?.stablecoin_token.symbol ?? "?",
      address: market?.stablecoin_token?.address ?? "",
    };
  }
}

// Rows
type Row = { description: string; value: unknown };
const properties = computed(() => [
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
    gap: 1ch;
    grid-template-columns: 26px 2fr 8fr auto;
    justify-content: space-between;
    align-items: center;

    img {
      aspect-ratio: 1;
      max-width: 100%;
      object-fit: contain;
      border-radius: 50%;
    }
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
