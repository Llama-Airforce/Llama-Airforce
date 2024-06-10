<template>
  <div class="tvl">
    <div class="value">
      <AsyncValue
        :value="tvl"
        :precision="1"
        :show-zero="true"
        type="dollar"
      />
    </div>
    <div class="label">{{ t("tvl") }}</div>
  </div>
</template>

<script setup lang="ts">
import { type PounderState } from "@Pounders/Models";

const { t } = useI18n();

// Props
interface Props {
  state: PounderState;
}

const { state } = defineProps<Props>();

const tvl = computed(() => {
  const { tvl, priceUnderlying, priceShare, decimalsWithdraw } = state;

  if (
    tvl === undefined ||
    priceUnderlying === undefined ||
    priceShare === undefined
  ) {
    return undefined;
  }

  return bigNumToNumber(tvl, decimalsWithdraw) * priceUnderlying * priceShare;
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.tvl {
  width: 10rem;

  @media only screen and (max-width: 1280px) {
    width: auto;
  }
}
</style>

<i18n lang="yaml" locale="en">
tvl: TVL
</i18n>

<i18n lang="yaml" locale="zh">
tvl: TVL
</i18n>

<i18n lang="yaml" locale="fr">
tvl: TVL
</i18n>
