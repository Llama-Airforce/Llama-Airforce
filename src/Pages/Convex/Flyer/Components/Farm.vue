<template>
  <div class="farm">
    <div class="title">Income</div>

    <div class="values">
      <div class="cvx">
        <div class="content">
          <span class="value">
            <AsyncValue
              :value="cvxApr"
              :precision="0"
              type="percentage"
            />
            APR
          </span>
          <span class="description">
            Locked CVX earns
            <AsyncValue
              :value="cvxApr"
              :precision="0"
              type="percentage"
            />
            APR with incentives.
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
            APR
          </span>
          <span class="description">
            Staked cvxCRV earns
            <AsyncValue
              :value="cvxCrvApr"
              :precision="0"
              type="percentage"
            />
            APR.
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import { $computed } from "vue/macros";
import AsyncValue from "@/Framework/AsyncValue.vue";
import FlyerConvex from "@/Pages/Convex/Flyer/Models/FlyerConvex";

// Props
interface Props {
  model: FlyerConvex | null;
}

const { model } = defineProps<Props>();

// Refs
const cvxApr = $computed((): number | undefined => {
  return model?.cvxApr;
});

const cvxCrvApr = $computed((): number | undefined => {
  return model?.cvxCrvApr;
});
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.farm {
  display: flex;
  flex-direction: column;
  text-align: center;

  .title {
    color: $blue;
    font-weight: normal;
  }

  .values {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    grid-gap: $border-size;
    background-color: $green;

    > div {
      background-color: $background-color;
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
        color: $green;
      }
    }

    .crv {
      display: flex;

      @media screen and (max-width: 1280px) {
        flex-direction: column;
      }

      .value {
        color: $red;
      }
    }
  }
}
</style>
