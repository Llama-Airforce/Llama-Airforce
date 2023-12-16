<template>
  <Card :title="t('redemption-details')">
    <div class="redemption-details">
      <div class="kpis">
        <KPI :label="t('withdrawal')">
          <AsyncValue
            :value="redemption.attempted_debt_amount"
            :precision="2"
            type="dollar"
          ></AsyncValue>

          /

          <AsyncValue
            :value="redemption.collateral_sent_to_redeemer_usd"
            :precision="2"
            type="dollar"
          ></AsyncValue>
        </KPI>

        <KPI :label="t('fee')">
          <AsyncValue
            :value="redemption.collateral_fee_usd"
            :precision="2"
            type="dollar"
          ></AsyncValue>
        </KPI>
      </div>

      <DataTable
        class="datatable-troves-affected"
        columns-header="2fr 1fr"
        columns-data="troves-affected-columns-data"
        :rows="rows"
        :columns="['Trove']"
      >
        <template #header-content>
          <div class="title">{{ t("troves-affected") }}</div>

          <InputText
            v-model="search"
            class="search"
            :search="true"
            :placeholder="t('search-placeholder')"
          >
          </InputText>
        </template>

        <template #row="props: { item: Row }">
          <div>
            <a
              class="font-mono"
              target="_blank"
              :href="`#/vault/${vaultAddr}/trove/${props.item}`"
              @click.stop
            >
              {{ props.item }}
            </a>
          </div>
        </template>
      </DataTable>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { ref, computed } from "vue";
import { useI18n } from "vue-i18n";
import { chain } from "lodash";
import { AsyncValue, Card, DataTable, KPI, InputText } from "@/Framework";
import { type Redemption } from "@PM/Services";

type Row = string;

const { t } = useI18n();

// Props
interface Props {
  vaultAddr: string;
  redemption: Redemption;
}

const { redemption } = defineProps<Props>();

// Refs
const search = ref("");

const rows = computed((): string[] =>
  chain(redemption.troves_affected)
    .filter((trove) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string): boolean =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(trove);
    })
    .value()
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.redemption-details {
  width: 640px;

  display: flex;
  flex-direction: column;
  gap: 2rem;

  > .kpis {
    display: flex;
    gap: 1rem;

    > .kpi {
      background: var(--c-lvl2);
    }
  }

  > .datatable-troves-affected {
    width: 100%;
    padding: 0;
    max-height: 50ch;

    .title {
      margin-right: 1rem;
    }

    .search {
      font-size: 0.875rem;
    }

    ::v-deep(.troves-affected-columns-data) {
      display: grid;
      grid-template-columns: 1fr;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
troves-affected: Troves affected
search-placeholder: Search for...
redemption-details: Redemption Details
withdrawal: Attempted / Received
fee: Fee
</i18n>
