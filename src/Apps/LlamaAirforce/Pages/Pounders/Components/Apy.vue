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

<i18n lang="yaml" src="@/locales/union.yml"></i18n>
