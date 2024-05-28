<template>
  <div class="apy">
    <div class="value">
      <Tooltip>
        <template #item>
          <div class="value-tooltip">
            <AsyncValue
              :value="apy"
              :precision="2"
              type="percentage"
            />
          </div>
        </template>

        <span
          class="info"
          v-html="t('apy-info')"
        >
        </span>

        <ul class="fees">
          <li v-if="fees?.platform !== 0">
            <div>{{ t("fee-on-yield") }}</div>
            <div>
              <AsyncValue
                :value="fees?.platform"
                :precision="2"
                type="percentage"
              />
            </div>
          </li>
          <li v-if="fees?.caller !== 0">
            <div>{{ t("caller-incentive") }}</div>
            <div>
              <AsyncValue
                :value="fees?.caller"
                :precision="2"
                type="percentage"
              />
            </div>
          </li>
          <li v-if="fees?.withdrawal !== 0">
            <div>{{ t("withdrawal-fee") }}</div>
            <div>
              <AsyncValue
                :value="fees?.withdrawal"
                :precision="2"
                type="percentage"
              />
            </div>
          </li>
        </ul>
      </Tooltip>
    </div>
    <div class="label">{{ t("apy") }}</div>
  </div>
</template>

<script setup lang="ts">
import { type Fees } from "@Pounders/Models/Fees";

const { t } = useI18n();

// Props
interface Props {
  apy: number | null;
  fees: Fees | null;
}

const { apy, fees } = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.apy {
  width: 10rem;

  @media only screen and (max-width: 1280px) {
    width: auto;
  }
}
</style>

<i18n lang="yaml" locale="en">
apy: APY
apy-info: "APY calculation assumes weekly compounding<br />and excludes the
  following fees:"
fee-on-yield: "Fee on yield:"
caller-incentive: "Caller incentive (fee on yield):"
withdrawal-fee: "Withdrawal fee (on total deposit):"
</i18n>

<i18n lang="yaml" locale="zh">
apy: APY
apy-info: "APY计算基于按周复投的计算<br />并排除了以下费用:"
fee-on-yield: "收益费:"
caller-incentive: "触发激励 (基于收益的费用):"
withdrawal-fee: "提款费 (基于总存款的费用):"
</i18n>

<i18n lang="yaml" locale="fr">
apy: APY
apy-info:
  "Le calcul de l'APY suppose une capitalisation hebdomadaire<br />et exclut les
  frais suivants :"
fee-on-yield: "Frais sur le rendement :"
caller-incentive: "Incitatif pour l'appelant (frais sur le rendement) :"
withdrawal-fee: "Frais de retrait (sur le dépôt total) :"
</i18n>
