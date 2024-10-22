<script setup lang="ts">
import { type Liquidation } from "@PM/Services";

const { t } = useI18n();

const { liquidation } = defineProps<{
  vaultAddr: string;
  liquidation: Liquidation;
}>();

// Refs
const search = ref("");

const rows = computed(() =>
  liquidation.troves_affected.filter((trove) => {
    const terms = search.value.toLocaleLowerCase().split(" ");

    const includesTerm = (x: string): boolean =>
      terms.some((term) => x.toLocaleLowerCase().includes(term));

    return includesTerm(trove);
  })
);
</script>

<template>
  <Card :title="t('liquidation-details')">
    <div class="liquidation-details">
      <div class="kpis">
        <KPI :label="t('debt')">
          <AsyncValue
            type="dollar"
            :value="liquidation.liquidated_debt"
            :precision="2"
          />

          /

          <AsyncValue
            type="dollar"
            :value="liquidation.liquidated_collateral"
            :precision="2"
            :show-symbol="false"
          />
        </KPI>

        <KPI :label="t('gas-compensation')">
          <AsyncValue
            type="dollar"
            :value="liquidation.collateral_gas_compensation_usd"
            :precision="2"
          />
        </KPI>
      </div>

      <Card
        compact
        :title="t('troves-affected')"
      >
        <template #actions>
          <InputText
            v-model="search"
            search
            :placeholder="t('search-placeholder')"
          />
        </template>

        <Table
          class="troves-affected-table"
          :rows
          :columns="['Trove']"
        >
          <template #row="{ item }">
            <div>
              <a
                class="font-mono"
                target="_blank"
                :href="`#/vault/${vaultAddr}/trove/${item}`"
                @click.stop
              >
                {{ item }}
              </a>
            </div>
          </template>
        </Table>
      </Card>
    </div>
  </Card>
</template>

<style scoped>
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
