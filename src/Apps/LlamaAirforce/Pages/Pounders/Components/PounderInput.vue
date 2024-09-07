<script setup lang="ts">
const { t } = useI18n();

const {
  balance = null,
  decimals,
  token,
  modelValue,
  price = 0,
} = defineProps<{
  balance?: bigint | null;
  decimals: bigint;
  token: string;
  modelValue: bigint;
  price?: number;
}>();

const emit = defineEmits<{
  "update:modelValue": [value: bigint];
}>();

// Refs
const value = ref(0);

const balanceNumber = computed((): number => {
  if (!balance || !decimals) {
    return 0;
  }

  const value = bigNumToNumber(balance, decimals);

  // We round this number to prevent balances like 5e-10.
  return value >= 0.01 ? value : 0;
});

const valueDollar = computed((): number => {
  if (!value.value || !price) {
    return 0;
  }

  return value.value * price;
});

const step = computed((): number => {
  return 1 / 10 ** 8;
});

// Watches
watch(value, (value) => {
  try {
    // Incoming type may not be number, typing is fake news.
    if (typeof value === "string") {
      value = parseFloat(value);
    }

    emit("update:modelValue", numToBigNumber(value, decimals));
  } catch {
    // nothing
  }
});

watch(
  () => modelValue,
  (newValue) => {
    value.value = bigNumToNumber(newValue, decimals);
  },
  { immediate: true }
);

// Events
const onMax = (): void => {
  if (balance) {
    value.value = bigNumToNumber(balance, decimals);
  }
};
</script>

<template>
  <div class="pounder-input">
    <div class="input">
      <div class="labels">
        <div class="balance">
          <div class="value">
            {{ t("balance") }} {{ balanceNumber }} {{ token }}
          </div>
          <a
            class="max"
            @click="onMax"
          >
            {{ t("max") }}
          </a>
        </div>

        <div
          class="dollars"
          :class="{ hide: price === 0 }"
        >
          {{ t("dollars") }}
          <AsyncValue
            :value="valueDollar"
            :precision="2"
            :show-zero="true"
            type="dollar"
          />
        </div>
      </div>

      <InputNumber
        v-model="value"
        :min="0"
        :max="balanceNumber"
      ></InputNumber>
    </div>

    <Slider
      v-model="value"
      class="slider"
      :min="0"
      :max="balanceNumber"
      :step="step"
    ></Slider>
  </div>
</template>

<style lang="scss" scoped>
.pounder-input {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  gap: 1.5rem;
  margin: 2rem 0;

  > .input {
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    gap: 1.5rem;

    > .labels {
      display: flex;
      flex-direction: column;
      gap: 0.25rem;

      > .balance {
        display: flex;
        justify-content: space-between;

        > .max {
          cursor: pointer;
          user-select: none;
        }
      }

      > .dollars {
        &.hide {
          visibility: hidden;
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
balance: "Balance:"
max: Max
dollars: "Dollars:"
</i18n>

<i18n lang="yaml" locale="zh">
balance: "余额:"
max: 最大
dollars: "美元:"
</i18n>

<i18n lang="yaml" locale="fr">
balance: "Solde :"
max: Max
dollars: "Dollars :"
</i18n>
