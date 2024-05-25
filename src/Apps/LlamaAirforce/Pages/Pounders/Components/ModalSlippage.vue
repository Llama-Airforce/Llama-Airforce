<template>
  <ModalYesNo
    class="modal-slippage"
    :title="t('price-modal-title')"
    :show="show"
    :ready="minAmountOut > 0"
    :ready-msg="t('no-zero')"
    @close="emit('close')"
    @yes="emit('yes', minAmountOut)"
    @no="emit('no')"
  >
    <div class="info">
      {{ t("slippage-info") }}
    </div>

    <div class="slippage">
      <span>{{ t("percentage") }}</span>
      <Slider
        v-model="slippage"
        :min="0.001"
        :max="0.2"
        :step="0.001"
      ></Slider>
      <span>
        {{ (Math.round(slippage * 100 * 1000) / 1000).toFixed(2) }}%
      </span>

      <span>{{ t("min-amount") }}</span>
      <InputNumber
        v-model="minAmountOut"
        :min="0"
        :max="Infinity"
      ></InputNumber>
      <span>{{ symbolOutput }}</span>
    </div>
  </ModalYesNo>
</template>

<script setup lang="ts">
const { t } = useI18n();

// Props
interface Props {
  show: boolean;
  symbolOutput: string;
  minAmountOutRef: number;
}

const { show, symbolOutput, minAmountOutRef } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  close: [];
  yes: [newMinAmountOut: number];
  no: [];
}>();

// Refs
const slippage = ref(0.03);
const minAmountOut = ref(0);

// Watches
watch([slippage, () => minAmountOutRef], ([newSlippage]) => {
  minAmountOut.value = minAmountOutRef * (1 - newSlippage);
});

watch(
  () => show,
  () => {
    slippage.value = 0.03;
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.modal-slippage {
  .info {
    width: 40rem;
    color: #a1a1aa;
  }

  .slippage {
    width: 40rem;
    display: grid;
    gap: 1rem;
    align-items: center;

    grid-template-columns: auto 1fr minmax(4rem, auto);
    grid-template-rows: 1fr 1fr;

    margin-top: 2rem;
  }
}
</style>

<i18n lang="yaml" src="@/locales/union.yml"></i18n>
