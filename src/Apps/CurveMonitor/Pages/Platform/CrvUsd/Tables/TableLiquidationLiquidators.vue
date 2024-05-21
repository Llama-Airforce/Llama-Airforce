<template>
  <DataTable
    class="datatable-liquidators"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="liquidators-columns-data"
    :loading
    :rows
    :columns="['Address', 'Count', 'Value']"
  >
    <template #header-content>
      <div class="title">{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Liquidators }">
      <div class="address">
        <a
          :href="`https://etherscan.io/address/${props.item.address}`"
          target="_blank"
        >
          {{ addressShort(props.item.address, 8) }}
        </a>
      </div>
      <div class="number">
        <AsyncValue
          :value="props.item.count"
          :precision="0"
          :show-zero="true"
        />
      </div>

      <div class="number">
        <AsyncValue
          :value="props.item.value"
          :precision="1"
          type="dollar"
        />
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { addressShort } from "@/Wallet";
import { type Market, type Liquidators } from "@CM/Services/CrvUsd";
import { useQueryLiquidators } from "@CM/Services/CrvUsd/Queries";

const { t } = useI18n();

// Props
interface Props {
  market: Market | undefined;
}

const { market } = defineProps<Props>();

// Data
const { isFetching: loading, data: rowsRaw } = useQueryLiquidators(
  toRef(() => market)
);

// Refs
const rows = computed((): Liquidators[] =>
  chain(rowsRaw.value)
    .map((x) => x)
    .value()
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-liquidators {
  container-type: inline-size;

  ::v-deep(.liquidators-columns-data) {
    --col-width: 12ch;

    display: grid;
    grid-template-columns: 1fr repeat(2, var(--col-width));

    // Non mobile
    @media only screen and (min-width: 1280px) {
      @container (max-width: 750px) {
        --col-width: 11ch;
      }

      @container (max-width: 650px) {
        --col-width: 10ch;
      }

      @container (max-width: 600px) {
        --col-width: 9ch;
      }

      @container (max-width: 575px) {
        --col-width: 8ch;
      }
    }

    // Mobile
    @media only screen and (max-width: 1280px) {
      @container (max-width: 575px) {
        --col-width: 11ch;
      }

      @container (max-width: 525px) {
        --col-width: 10ch;
      }

      @container (max-width: 500px) {
        --col-width: 9ch;
      }

      @container (max-width: 475px) {
        --col-width: 8ch;
      }

      @container (max-width: 450px) {
        --col-width: 7ch;
      }

      @container (max-width: 425px) {
        --col-width: 6ch;
      }

      @container (max-width: 375px) {
        grid-template-columns: 1fr repeat(2, var(--col-width));
      }

      @container (max-width: 325px) {
        grid-template-columns: 1fr repeat(1, var(--col-width));
      }

      @container (max-width: 250px) {
        grid-template-columns: 1fr;

        div:nth-child(2) {
          display: none;
        }
      }
    }

    // Right adjust number columns.
    div:nth-child(2),
    div:nth-child(3) {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Top Liquidators
</i18n>
