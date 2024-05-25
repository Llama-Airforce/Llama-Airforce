<template>
  <div class="balance">
    <div class="value">
      <Tooltip>
        <template #item>
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

<script setup lang="ts">
import { type PounderState } from "@Pounders/Models/PounderState";
import {
  getBalanceUnclaimed,
  getBalanceUnderlying,
  getBalanceDollars,
} from "@Pounders/Util/PounderStateHelper";

const { t } = useI18n();

// Props
interface Props {
  symbol: string;
  state: PounderState;
}

const { symbol, state } = defineProps<Props>();

const balance = computed((): number | null => getBalanceDollars(state));

const balanceUnderlying = computed((): number | null =>
  getBalanceUnderlying(state)
);

const balanceUnclaimed = computed((): number | null =>
  getBalanceUnclaimed(state)
);

const hasUnclaimed = computed(
  (): boolean => state.balanceUnclaimed !== null && state.balanceUnclaimed > 0n
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.balance {
  width: 10rem;

  @media only screen and (max-width: 1280px) {
    width: auto;
  }
}
</style>

<i18n lang="yaml" src="@/locales/union.yml"></i18n>
