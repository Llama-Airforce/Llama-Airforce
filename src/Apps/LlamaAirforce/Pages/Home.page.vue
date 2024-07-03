<template>
  <div class="home">
    <div class="dashboard">
      <Card
        style="grid-area: pirex"
        class="topic-card"
        @click="goto('pirex')"
      >
        <div class="topic">
          <img src="@/Assets/Menu/pirex.webp" />

          <div class="description">{{ t("description-pirex") }}</div>

          <div class="points">
            <ul>
              <li>{{ t("point-pirex-1") }}</li>
              <li>{{ t("point-pirex-2") }}</li>
              <li>{{ t("point-pirex-3") }}</li>
              <li>{{ t("point-pirex-4") }}</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card
        style="grid-area: union"
        class="topic-card"
        @click="goto('union')"
      >
        <div class="topic">
          <img src="@/Assets/Menu/union.png" />

          <div class="description">{{ t("description-union") }}</div>

          <div class="points">
            <ul>
              <li>{{ t("point-union-1") }}</li>
              <li>{{ t("point-union-2") }}</li>
              <li>{{ t("point-union-3") }}</li>
              <li>{{ t("point-union-4") }}</li>
            </ul>
          </div>
        </div>
      </Card>

      <Card
        style="grid-area: votium"
        class="topic-card"
        @click="goto('incentives')"
      >
        <div class="topic">
          <img src="@/Assets/Menu/votium.png" />

          <div class="description">{{ t("description-votium") }}</div>

          <div class="points">
            <ul>
              <li>{{ t("point-votium-1") }}</li>
              <li>{{ t("point-votium-2") }}</li>
              <li>{{ t("point-votium-3") }}</li>
              <li>{{ t("point-votium-4") }}</li>
            </ul>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n();

const router = useRouter();

function goto(card: "union" | "pirex" | "incentives") {
  void router.push(`/${card}`);
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboardLAF("home");

@keyframes pulse {
  0% {
    transform: scale(0.9);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.9);
  }
}

.home {
  .dashboard {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;
    grid-template-areas: "pirex union votium";

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
    }

    ::v-deep(.topic-card) {
      &:hover {
        cursor: pointer;

        .card-container {
          background-color: var(--c-lvl2);
        }

        .topic {
          > img {
            animation: pulse 0.5s infinite;
          }
        }
      }
    }

    .topic {
      margin: 1rem;

      display: flex;
      flex-direction: column;
      gap: 1rem;

      @media only screen and (max-width: 1280px) {
        gap: 2rem;
      }

      > img {
        grid-row: 1;
        grid-column: 1;

        place-self: center;
        margin-bottom: 1rem;
      }

      > .description {
        grid-row: 1;
        grid-column: 2;

        text-wrap: pretty;

        @media only screen and (max-width: 1280px) {
          font-size: 1rem;
        }
      }

      > .points {
        grid-row: 2;
        grid-column: 1 / -1;

        ul {
          display: flex;
          flex-direction: column;

          margin-block-start: 0;
          margin-block-end: 0;
          padding-inline-start: 0rem;

          li {
            text-wrap: pretty;
            margin: 0.5rem 1rem;
            list-style-type: square;

            &::marker {
              color: var(--c-primary);
            }
          }
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
description-pirex: pxCVX is a liquid wrapper specifically designed for vlCVX.
  Known as a 'pure' liquid wrapper, each pxCVX token is directly backed by one vlCVX token,
  and there is no additional leverage risk.

point-pirex-1: Llama Airforce operates a pxCVX Pounder vault, which converts the underlying incentives into more pxCVX.
point-pirex-2: Pirex automatically re-locks CVX as vlCVX, unless a redemption is initiated.
point-pirex-3: Pirex maintains a pxCVX/CVX liquidity pool for instant swapping, usually at a discount.
point-pirex-4:
  pxCVX can be redeemed for CVX, as each pxCVX is backed 1:1 by CVX.
  There is a redemption fee that scales inversely with the unlock time..

description-union:
  By joining The Union you forward your bribe rewards to Llama Airforce,
  we collectively claim them, swap all of them for cvxCRV, put it in an auto-compounder
  and finally airdrop you the pounder shares.

point-union-1:
  The Union does not hold custody of your CVX, you remain in full control
  of your tokens.
point-union-2:
  Just like with Votium, the rewards roll over and you are not required
  to claim immediately.
point-union-3: The airdropped rewards will auto-compound even when unclaimed.
point-union-4:
  By also delegating to votium.eth you don't even have to worry about
  voting and maximizing your output.

description-votium:
  Votium is an incentives platform where vlCVX and veCRV holders earn rewards from buyers seeking deep liquidity.
  Delegating/Voting carries no risk to your funds, as you always retain custody of your vlCVX and veCRV.

point-votium-1:
  Allows protocols to buy CRV emissions through Convex's governance
  system.
point-votium-2: vlCVX holders are free to accept the incentive rewards to their likings.
point-votium-3:
  Rewards roll over to the next round and claiming immediately is not
  required.
point-votium-4: Delegating to votium.eth automates voting for the best $ / vlCVX possible.
</i18n>
