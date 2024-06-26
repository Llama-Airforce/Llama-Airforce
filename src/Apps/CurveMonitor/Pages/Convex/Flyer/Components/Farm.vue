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
          src="@/Assets/Flyer/cvx.png"
        />
      </div>

      <div class="crv">
        <img
          class="logo"
          src="@/Assets/Icons/Tokens/cvxcrv.png"
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
import { getPublicClient } from "@wagmi/core";
import { useConfig } from "@wagmi/vue";
import { useWallet } from "@/Wallet";
import { DefiLlamaService } from "@/Services";
import { type FlyerConvex } from "@/Services/FlyerService";

const { t } = useI18n();

const llamaService = new DefiLlamaService(useHost());

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const { address } = useWallet();
const config = useConfig();

const cvxCrvApr = ref<number | undefined>(undefined);

const cvxApr = computed((): number | undefined => {
  return model?.cvxApr;
});

watch(
  address,
  async () => {
    const client = getPublicClient(config);
    if (!client) throw Error("Cannot create public viem client");

    const aprs = await getCvxCrvAprs(client, llamaService);

    // Take the average APR of gov rewards and stable
    const apr = aprs.reduce((acc, x) => acc + x, 0) / 2;

    cvxCrvApr.value = apr * 100;
  },
  { immediate: true }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.farm {
  display: flex;
  flex-direction: column;
  text-align: center;

  .title {
    color: var(--c-blue);
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
