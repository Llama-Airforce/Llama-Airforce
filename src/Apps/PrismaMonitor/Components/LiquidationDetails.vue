<template>
  <Card :title="t('liquidation-details')">
    <div class="liquidation-details">
      <div class="kpis">
        <KPI :label="t('debt')">
          <AsyncValue
            :value="liquidation.liquidated_debt"
            :precision="2"
            type="dollar"
          ></AsyncValue>

          /

          <AsyncValue
            :value="liquidation.liquidated_collateral"
            :precision="2"
            :show-symbol="false"
            type="dollar"
          ></AsyncValue>
        </KPI>

        <KPI :label="t('gas-compensation')">
          <AsyncValue
            :value="liquidation.collateral_gas_compensation_usd"
            :precision="2"
            type="dollar"
          ></AsyncValue>
        </KPI>
      </div>

      <Card
        :title="t('troves-affected')"
        :compact="true"
      >
        <template #actions>
          <InputText
            v-model="search"
            :search="true"
            :placeholder="t('search-placeholder')"
          >
          </InputText>
        </template>

        <DataTable
          class="troves-affected-table"
          :rows="rows"
          :columns="['Trove']"
        >
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
      </Card>
    </div>
  </Card>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type Liquidation } from "@PM/Services";

type Row = string;

const { t } = useI18n();

// Props
interface Props {
  vaultAddr: string;
  liquidation: Liquidation;
}

const { liquidation } = defineProps<Props>();

// Refs
const search = ref("");

const rows = computed((): string[] =>
  chain(liquidation.troves_affected)
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

.liquidation-details {
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

  > .troves-affected-table {
    --columns-data: 1fr;

    width: 100%;
    padding: 0;
    max-height: 50ch;
  }
}
</style>

<i18n lang="yaml" locale="en">
troves-affected: Troves affected
search-placeholder: Search for...
liquidation-details: Liquidation Details
debt: Debt / Collateral
gas-compensation: Gas compensation
</i18n>
