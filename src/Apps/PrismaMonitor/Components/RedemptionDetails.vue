<script setup lang="ts">
import { type Redemption } from "@PM/Services";

const { t } = useI18n();

const { redemption } = defineProps<{
  vaultAddr: string;
  redemption: Redemption;
}>();

// Refs
const search = ref("");

const rows = computed(() =>
  redemption.troves_affected.filter((trove) => {
    const terms = search.value.toLocaleLowerCase().split(" ");

    const includesTerm = (x: string): boolean =>
      terms.some((term) => x.toLocaleLowerCase().includes(term));

    return includesTerm(trove);
  })
);
</script>

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

        <Table
          class="troves-affected-table"
          :rows="rows"
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
redemption-details: Redemption Details
withdrawal: Attempted / Received
fee: Fee
</i18n>
