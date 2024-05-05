<template>
  <div class="summary">
    <KPI
      :label="t('total')"
      :has-value="true"
    >
      <AsyncValue
        :value="total"
        :precision="2"
        type="dollar"
      />
    </KPI>

    <KPI
      :label="t('match-ratio')"
      :has-value="true"
    >
      <AsyncValue
        :value="ratio"
        :precision="0"
        type="percentage"
      />
    </KPI>
  </div>
</template>

<script setup lang="ts">
import { AsyncValue, KPI } from "@/Framework";
import type { EpochFrax } from "@LAF/Pages/Bribes/FraxMatch/Models/EpochFrax";

const { t } = useI18n();

// Props
interface Props {
  epochs: EpochFrax[];
}

const { epochs = [] } = defineProps<Props>();

const totalNative = computed((): number =>
  epochs.reduce((acc, epoch) => acc + epoch.native, 0)
);

const totalFrax = computed((): number =>
  epochs.reduce((acc, epoch) => acc + epoch.frax, 0)
);

const total = computed((): number => totalNative.value + totalFrax.value);
const ratio = computed(
  (): number => (totalFrax.value / totalNative.value) * 100
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.summary {
  display: flex;
  justify-content: space-evenly;
  flex-grow: 1;
  gap: 1.5rem;
}
</style>

<i18n lang="yaml" locale="en">
total: Total
match-ratio: Match Ratio
</i18n>
