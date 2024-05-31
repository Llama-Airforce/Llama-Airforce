<template>
  <ModalYesNo
    :title="t('price-modal-title')"
    :show="show"
    :ready="minAmountOut > 0"
    :ready-msg="t('no-zero')"
    @close="emit('close')"
    @yes="emit('yes', minAmountOut)"
    @no="emit('no')"
  >
    <div class="content">
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
.content {
  min-width: 30rem;
  width: 33vw;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.info {
  color: #a1a1aa;
}

.slippage {
  display: grid;
  gap: 1rem;
  align-items: center;

  grid-template-columns: auto 1fr minmax(4rem, auto);
  grid-template-rows: 1fr 1fr;

  margin-top: 2rem;
}
</style>

<i18n lang="yaml" locale="en">
price-modal-title: Price control
percentage: Percentage
min-amount: Min Amount
no-zero: Zero min amount not allowed
slippage-info:
  Price control is a safeguard against excessive slippage or sandwich attacks.
  By setting a minimum percentage for your input, you establish a lower limit for your returns.
  If you encounter a slippage error, the value you set might be too low.
  A slight increase of one or two percent could help, but don't make it too high to ensure your protection.
</i18n>

<i18n lang="yaml" locale="zh">
price-modal-title: 价格控制
percentage: 百分比
min-amount: 最小数量
no-zero: 最小数量不能为0
slippage-info: 价格控制是防止过度滑点或夹心层攻击的一种保障措施。通过设定输入的最低百分比，可以为收益设定一个下限。如果您遇到滑点错误，您设定的值可能太低。稍微增加一到两个百分点可能会有帮助，但不要太高，以确保您的保护。
</i18n>

<i18n lang="yaml" locale="fr">
price-modal-title: Contrôle des prix
percentage: Pourcentage
min-amount: Montant minimum
no-zero: Montant minimum zéro non autorisé
slippage-info:
  Le contrôle des prix est une protection contre les dérapages excessifs ou les attaques en sandwich.
  En fixant un pourcentage minimum pour vos intrants, vous établissez une limite inférieure pour vos retours.
  Si vous rencontrez une erreur de dérapage, la valeur que vous avez fixée est peut-être trop basse.
  Une légère augmentation d'un ou deux pour cent pourrait être utile, mais ne la fixez pas trop haut pour assurer votre protection.
</i18n>
