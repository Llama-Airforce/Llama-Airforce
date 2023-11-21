<template>
  <div class="farm">
    <div class="title">{{ t("income") }}</div>

    <div class="values">
      <div class="cvx">
        <div class="content">
          <span class="value">
            <AsyncValue
              :value="cvxApr"
              :precision="0"
              type="percentage"
            />
            {{ t("apr") }}
          </span>
          <span class="description">
            {{ t("apr-1") }}
            <AsyncValue
              :value="cvxApr"
              :precision="0"
              type="percentage"
            />
            {{ t("apr-2") }}
          </span>
        </div>

        <img
          class="logo"
          src="@/Assets/cvx.png"
        />
      </div>

      <div class="crv">
        <img
          class="logo"
          src="@/Assets/cvxcrv.png"
        />

        <div class="content">
          <span class="value">
            <AsyncValue
              :value="cvxCrvApr"
              :precision="0"
              type="percentage"
            />
            {{ t("apr") }}
          </span>
          <span class="description">
            {{ t("staked") }}
            <AsyncValue
              :value="cvxCrvApr"
              :precision="0"
              type="percentage"
            />
            {{ t("apr") }}.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useI18n } from "vue-i18n";
import { AsyncValue } from "@/Framework";
import { getCvxCrvAprs } from "@/Util";
import { getProvider, useWalletStore } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import { getHost } from "@/Services/Host";
import { type FlyerConvex } from "@LAF/Pages/Convex/Flyer/Models/FlyerConvex";

const { t } = useI18n();

const llamaService = new DefiLlamaService(getHost());

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const wallet = useWalletStore();

const cvxCrvApr = ref<number | undefined>(undefined);

const cvxApr = computed((): number | undefined => {
  return model?.cvxApr;
});

// Hooks
onMounted(async (): Promise<void> => {
  await update();
});

// Watches
const update = async (): Promise<void> => {
  const provider = getProvider();

  if (provider) {
    const aprs = await getCvxCrvAprs(provider, llamaService);

    // Take the average APR of gov rewards and stable
    const apr = aprs.reduce((acc, x) => acc + x, 0) / 2;

    cvxCrvApr.value = apr * 100;
  }
};

watch(() => wallet.address, update);

// Hooks
onMounted(async () => {
  await update();
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.farm {
  display: flex;
  flex-direction: column;
  text-align: center;

  .title {
    color: var(--c-blue);
    font-weight: normal;
  }

  .values {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: $border-size;
    background-color: var(--c-green);

    > div {
      background-color: var(--c-lvl0);
      padding: 1rem 0;
    }

    .logo {
      object-fit: scale-down;
      display: flex;
      justify-content: center;
      align-items: center;
      height: 165px;
    }

    .cvx .logo {
      margin-right: 1rem;
    }

    .crv .logo {
      margin-left: 1rem;
    }

    .content {
      display: flex;
      flex-direction: column;
    }

    .content {
      .value {
        font-size: 2rem !important;
      }

      .description {
        font-size: 1rem !important;
        margin: 0 0.5rem;
      }
    }

    .cvx {
      display: flex;

      @media screen and (max-width: 1280px) {
        flex-direction: column;
      }

      .value {
        color: var(--c-green);
      }
    }

    .crv {
      display: flex;

      @media screen and (max-width: 1280px) {
        flex-direction: column;
      }

      .value {
        color: var(--c-red);
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
income: Income
apr: APR

apr-1: Locked CVX earns
apr-2: APR with incentives.

staked: Staked cvxCRV earns
</i18n>
