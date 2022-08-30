<template>
  <div class="home">
    <div class="dashboard">
      <Card class="topic">
        <router-link
          to="/curve"
          class="logo"
        >
          <img
            class="logo-img"
            src="/headers/curve.png"
          />
        </router-link>

        <div class="description">
          Curve is a decentralized exchange liquidity pool on Ethereum designed
          for extremely efficient stablecoin trading, but also supports volatile
          crypto pairs that automatically manage concentrated liquidity for
          liquidity providers.
        </div>

        <div class="points">
          <ul>
            <li>
              Offers one of the deepest liquidity pools for DAI/USDC/USDT (3crv)
              with the lowest amount of slippage.
            </li>
            <li>
              Protocols can create their own stable or crypto pools, and can
              even pair them against 3crv or other base pools.
            </li>
            <li>
              Liquidity providers may be incentivized with CRV emissions through
              governance votes.
            </li>
            <li>
              Locking veCRV gives you both governance power and a share of the
              protocol's weekly revenue.
            </li>
          </ul>
        </div>

        <router-link
          to="/curve"
          class="visit"
        >
          <Button
            value="Go to Curve"
            :primary="true"
          ></Button>
        </router-link>
      </Card>

      <Card class="topic">
        <router-link
          to="/convex"
          class="logo"
        >
          <img
            class="logo-img"
            src="/headers/convex.png"
          />
        </router-link>

        <div class="description">
          Convex simplifies maximizing your yields by offering what is known as
          "communist boosties". Curve and Frax allow liquidity providers to
          boost their CRV rewards, but this requires locking tokens which costs
          a lot of gas. By incentivizing locking CRV and FXS on their platform,
          it is possible for Convex to give everybody a share of these boosts
          without locking.
        </div>

        <div class="points">
          <ul>
            <li>
              Allows liquidity providers to receive boosted yields for a small
              fee.
            </li>
            <li>
              Offers cvxCRV and cvxFXS, liquid veCRV and veFXS tokens whose
              revenue will always exceed that vanilla locking.
            </li>
            <li>
              Offers CVX, a token that gives users governance rights, platform
              fees and 'birbs'.
            </li>
          </ul>
        </div>

        <router-link
          to="/convex"
          class="visit"
        >
          <Button
            value="Go to Convex"
            :primary="true"
          ></Button>
        </router-link>
      </Card>

      <Card class="topic">
        <router-link
          to="/bribes"
          class="logo"
        >
          <img
            class="logo-img"
            src="/headers/votium.png"
          />
        </router-link>

        <div class="description">
          Votium is an incentives platform where vlCVX and veCRV holders can
          receive compensation from buyers interested in amassing deep liquidity
          through emission rewards. Delegating/Voting incurs no risk to user
          funds, you always retain custody of your vlCVX and veCRV.
        </div>

        <div class="points">
          <ul>
            <li>
              Allows protocols to buy CRV emissions through Convex's governance
              system.
            </li>
            <li>
              vlCVX holders are free to accept the incentive rewards to their
              likings.
            </li>
            <li>
              Rewards roll over to the next round and claiming immediately is
              not required.
            </li>
            <li>
              Delegating to votium.eth automates voting for the best $ / vlCVX
              possible.
            </li>
          </ul>
        </div>

        <router-link
          to="/bribes"
          class="visit"
        >
          <Button
            value="Go to Votium"
            :primary="true"
          ></Button>
        </router-link>
      </Card>

      <Card class="topic">
        <router-link
          to="/union"
          class="logo"
        >
          <img
            class="logo-img"
            src="/headers/union.png"
          />
        </router-link>

        <div class="description">
          By joining The Union you forward your bribe rewards to Llama Airforce,
          we collectively claim them, swap all of them for cvxCRV, put it in an
          auto-compounder and finally airdrop you the pounder shares.
        </div>

        <div class="points">
          <ul>
            <li>
              The Union does not hold custody of your CVX, you remain in full
              control of your tokens.
            </li>
            <li>
              Just like with Votium, the rewards roll over and you are not
              required to claim immediately.
            </li>
            <li>
              The airdropped rewards will auto-compound even when unclaimed.
            </li>
            <li>
              By also delegating to votium.eth you don't even have to worry
              about voting and maximizing your output.
            </li>
          </ul>
        </div>

        <router-link
          to="/union"
          class="visit"
        >
          <Button
            value="Go to Union"
            :primary="true"
          ></Button>
        </router-link>
      </Card>
    </div>
  </div>
</template>

<script
  setup
  lang="ts"
>
import Button from "@/Framework/Button.vue";
import Card from "@/Framework/Card.vue";
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";

.home {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;

  .dashboard {
    width: 100%;
    padding: 2.5rem;

    display: flex;
    gap: 2rem;

    @media only screen and (max-width: 1280px) {
      display: flex;
      flex-direction: column;
      padding: 1.5rem 1rem;
    }

    > .topic {
      @media only screen and (max-width: 1280px) {
        padding: 0 1rem;
        width: auto;
      }

      :deep(.card-body) {
        display: grid;

        grid-template-rows: auto 250px 1fr auto;
        grid-template-columns: 1fr;
        grid-gap: 2rem;

        @media only screen and (max-width: 1280px) {
          display: flex;
          flex-direction: column;
        }

        > .logo {
          display: flex;

          &:hover {
            all: unset;
            display: flex;
          }

          > .logo-img {
            width: 100%;
            height: 38px;
            object-fit: none;
            margin-top: 1rem;
            margin-bottom: 1rem;
            cursor: pointer;
          }
        }

        > .description {
          font-weight: lighter;
          line-height: 1.4rem;
          font-size: 0.8125rem;

          @media only screen and (max-width: 1280px) {
            font-size: 1rem;
          }
        }

        > .points {
          ul {
            margin-block-start: 0;
            margin-block-end: 0;
            padding-inline-start: 1rem;

            font-weight: lighter;
            line-height: 1.4rem;
            font-size: 0.8125rem;

            @media only screen and (max-width: 1280px) {
              font-size: 1rem;
            }

            li {
              margin-bottom: 0.5rem;
            }
          }
        }

        > .visit {
          display: flex;

          > button {
            flex-grow: 1;
            justify-content: center;
          }
        }
      }
    }
  }
}
</style>
