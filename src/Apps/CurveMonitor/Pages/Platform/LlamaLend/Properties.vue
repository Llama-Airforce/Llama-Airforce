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
            <img
              :src="icons[value.address]"
              @error="onIconError(value.address)"
            />

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
import { type Market } from "@CM/Services/LlamaLend";

const { t } = useI18n();

// Props
interface Props {
  market?: Market;
  chain?: Chain;
}

const { market, chain } = defineProps<Props>();

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

// Icons
const icons = reactive<Record<string, string>>({});
const onIconError = (controller: string) => {
  icons[controller] = "https://lend.curve.fi/images/default-crypto.png";
};
function icon(tokenAddress: string) {
  const chainSuffix = chain !== "ethereum" ? `-${chain}` : "";

  return `https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets${chainSuffix}/${tokenAddress}.png`;
}
watch(
  () => market,
  (newMarket) => {
    if (!newMarket) {
      return;
    }

    const collateral = getTokenInfo(
      "collateral",
      newMarket
    ).address.toLocaleLowerCase();

    const borrowed = getTokenInfo(
      "borrowed",
      newMarket
    ).address.toLocaleLowerCase();

    // Generate market icon addresses. This workflow is to add 404 fallback support.
    const newIcons = {
      [collateral]: icon(collateral),
      [borrowed]: icon(borrowed),
    };

    for (const key in icons) delete icons[key];
    Object.assign(icons, newIcons);
  },
  { immediate: true }
);
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
