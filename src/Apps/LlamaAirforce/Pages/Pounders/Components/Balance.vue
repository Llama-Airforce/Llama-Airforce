<script setup lang="ts">
import { type PounderState } from "@Pounders/Models";

const { t } = useI18n();

const { symbol, state } = defineProps<{
  symbol: string;
  state: PounderState;
}>();

/** The total withdrawable balance in dollars, including unclaimed amount. */
const balance = computed(() => {
  const {
    balanceWithdraw,
    balanceUnclaimed,
    priceUnderlying,
    priceShare,
    decimalsDeposit,
  } = state;

  if (
    priceUnderlying === undefined ||
    priceShare === undefined ||
    (balanceWithdraw === undefined && balanceUnclaimed === undefined)
  ) {
    return undefined;
  }

  const balance = (balanceWithdraw ?? 0n) + (balanceUnclaimed ?? 0n);

  return (
    bigNumToNumber(balance, decimalsDeposit) * priceUnderlying * priceShare
  );
});

/** The underlying aTkn value of the balance. */
const balanceUnderlying = computed(() => {
  const { balanceWithdraw, priceShare, decimalsDeposit } = state;

  if (balanceWithdraw === undefined || priceShare === undefined) {
    return;
  }

  return bigNumToNumber(balanceWithdraw, decimalsDeposit) * priceShare;
});

/** The underlying aTkn value of unclaimed value. */
const balanceUnclaimed = computed(() => {
  const { balanceUnclaimed, priceShare, decimalsDeposit } = state;

  if (balanceUnclaimed === undefined || priceShare === undefined) {
    return;
  }

  return bigNumToNumber(balanceUnclaimed, decimalsDeposit) * priceShare;
});

const hasUnclaimed = computed(
  () => state.balanceUnclaimed && state.balanceUnclaimed > 0n
);
</script>

<template>
  <div class="balance">
    <div class="value">
      <Tooltip>
        <template #trigger>
          <div class="value-tooltip">
            <AsyncValue
              :value="balance"
              :precision="1"
              :show-zero="true"
              type="dollar"
            />
          </div>
        </template>

        <ul class="underlying">
          <li>
            <div>{{ symbol }}:</div>
            <div style="display: flex; gap: 0.5rem; justify-content: end">
              <div>
                {{
                  (Math.round((balanceUnderlying || 0) * 1000) / 1000).toFixed(
                    3
                  )
                }}
              </div>
              <div v-if="state.symbolLpPrimary">
                (~{{
                  (
                    Math.round(
                      (balanceUnderlying || 0) *
                        2 *
                        1000 *
                        (1 - (1 - state.oraclePrice) / 2)
                    ) / 1000
                  ).toFixed(3)
                }}
                {{ state.symbolLpPrimary }})
              </div>
            </div>
          </li>
          <li v-if="hasUnclaimed">
            <div>{{ symbol }} (Union):</div>
            <div style="display: flex; gap: 0.5rem; justify-content: end">
              <div>
                {{
                  (Math.round((balanceUnclaimed || 0) * 1000) / 1000).toFixed(3)
                }}
              </div>
              <div v-if="state.symbolLpPrimary">
                (~{{
                  (
                    Math.round(
                      (balanceUnclaimed || 0) *
                        2 *
                        1000 *
                        (1 - (1 - state.oraclePrice) / 2)
                    ) / 1000
                  ).toFixed(3)
                }}
                {{ state.symbolLpPrimary }})
              </div>
            </div>
          </li>
        </ul>
      </Tooltip>
    </div>
    <div class="label">{{ t("your-balance") }}</div>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.balance {
  width: 10rem;

  @media only screen and (max-width: 1280px) {
    width: auto;
  }
}
</style>

<i18n lang="yaml" locale="en">
your-balance: Your Balance
</i18n>

<i18n lang="yaml" locale="zh">
your-balance: 你的余额
</i18n>

<i18n lang="yaml" locale="fr">
your-balance: Votre solde
</i18n>
