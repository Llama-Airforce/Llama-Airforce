<template>
  <DataTable
    class="datatable-deposits"
    columns-header="minmax(7rem, 1fr) minmax(auto, 25rem)"
    columns-data="deposits-columns-data"
    :loading="loading"
    :rows="rows"
    :columns="['Address', 'Amount', 'Date', 'Tx']"
  >
    <template #header-title>
      <div>{{ t("title") }}</div>
    </template>

    <template #row="props: { item: Deposits }">
      <div class="address">
        <a
          :href="`https://etherscan.io/address/${props.item.user}`"
          target="_blank"
        >
          {{ addressShort(props.item.user, 8) }}
        </a>
      </div>
      <div class="number">
        <AsyncValue
          :value="props.item.amount"
          :precision="2"
          :show-zero="true"
          type="dollar"
        />
      </div>

      <div class="number">
        {{ new Date(props.item.timestamp * 1000).toLocaleDateString() }}
      </div>
      <div class="address">
        <a
          :href="`https://etherscan.io/tx/${props.item.hash}`"
          target="_blank"
        >
          {{ addressShort(props.item.hash, 8) }}
        </a>
      </div>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import {onMounted, ref} from "vue";
import { addressShort } from "@/Wallet";
import { useI18n } from "vue-i18n";
import { AsyncValue, DataTable } from "@/Framework";
import { getHost } from "@/Services/Host";
import PrismaService, {
  type PoolStableOperation
} from "@PM/Services/PrismaService";
import {computed} from "vue";
import {chain} from "lodash";

const { t } = useI18n();

const prismaService = new PrismaService(getHost());

// Refs
const loading = ref(true);
const rowsRaw = ref<PoolStableOperation[]>([]);
const rows = computed((): PoolStableOperation[] =>
  chain(rowsRaw.value).map((x) => x)
    .value()
);


// Hooks
onMounted(async () => {
  loading.value = true;

  rowsRaw.value = await prismaService
    .getTopStableDeposits("ethereum", 5, "7d")
    .then((x) => x.operations);

  loading.value = false;
}
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-deposits {
  container-type: inline-size;

  ::v-deep(.deposits-columns-data) {

    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;

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
    div:nth-child(3), {
      justify-content: end;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Largest deposits past 7 days
</i18n>
