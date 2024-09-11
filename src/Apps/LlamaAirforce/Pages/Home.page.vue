<script setup lang="ts">
const { t } = useI18n();

const router = useRouter();

function goto(card: "union" | "pirex" | "incentives") {
  void router.push(`/${card}`);
}
</script>

<template>
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
</template>

<style scoped>
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

.dashboard {
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-areas: "pirex union votium";

  @media only screen and (max-width: 1280px) {
    & {
      display: flex;
      flex-direction: column;
    }
  }

  .topic-card {
    &:hover {
      cursor: pointer;

      background-color: var(--c-lvl2);

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
      & {
        gap: 2rem;
      }
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
        & {
          font-size: 1rem;
        }
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
</style>

<i18n lang="yaml" locale="en">
description-pirex:
  pxCVX is the cheapest liquid wrapper specifically designed for vlCVX.
  Known as a 'pure' liquid wrapper, each pxCVX token is directly backed by one vlCVX token,
  and there is no additional leverage risk.

point-pirex-1: Llama Airforce operates a pxCVX Pounder vault, which converts the underlying incentives into more pxCVX.
point-pirex-2: Pirex automatically re-locks CVX as vlCVX, unless a redemption is initiated.
point-pirex-3: Pirex maintains a pxCVX/CVX liquidity pool for instant swapping, usually at a discount.
point-pirex-4:
  pxCVX can be redeemed for CVX, as each pxCVX is backed 1:1 by CVX.
  There is a redemption fee that scales inversely with the unlock time.

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

<i18n lang="yaml" locale="zh">
description-pirex: pxCVX 是专为 vlCVX 设计的最便宜的液体包装。被称为 "纯 "流动包装，每个 pxCVX 代币直接由一个 vlCVX 代币支持、 而且没有额外的杠杆风险。

point-pirex-1: Llama Airforce 运营着一个 pxCVX Pounder 金库，它能将基础奖励转换成更多的 pxCVX。
point-pirex-2: 除非启动赎回，否则 Pirex 会自动将 CVX 重新锁定为 vlCVX。
point-pirex-3: Pirex 维护一个 pxCVX/CVX 流动性池，用于即时交换，通常有折扣。
point-pirex-4: pxCVX 可以兑换 CVX，因为每个 pxCVX 都得到 CVX 1:1 的支持。赎回费与解锁时间成反比。

description-union: 加入 "联盟 "后，您将把贿赂奖励转交给 "喇嘛空军"、 我们将集体认领这些奖励，把它们全部换成 cvxCRV，并将其放入自动复合机中 并最终向您空投 pounder 股份。

point-union-1: 联盟不会保管您的 CVX，您仍可完全控制您的代币。
point-union-2: 与 Votium 一样，奖励可以滚动，您无需 立即领取。
point-union-3: 即使无人认领，空投的奖励也会自动累积。
point-union-4: 通过委托 votium.eth，您甚至不必担心 投票和最大化产出。

description-votium: Votium 是一个奖励平台，vlCVX 和 veCRV 持有者可从寻求深度流动性的买家处获得奖励。委托/投票不会给您的资金带来任何风险，因为您始终保持对 vlCVX 和 veCRV 的保管。

point-votium-1: 允许协议通过 Convex 治理系统购买 CRV 排放量。系统。
point-votium-2: vlCVX 持有者可根据自己的喜好自由接受奖励。
point-votium-3: 奖励滚入下一轮，无需立即领取。
point-votium-4: 委托 votium.eth 可自动投票选出最佳 $/vlCVX。
</i18n>

<i18n lang="yaml" locale="fr">
description-pirex: Le pxCVX est l'enveloppe liquide la moins chère spécialement conçue pour le vlCVX. Connu sous le nom de "pure" liquid wrapper, chaque jeton pxCVX est directement soutenu par un jeton vlCVX, et il n'y a pas de risque d'effet de levier supplémentaire.

point-pirex-1: Llama Airforce exploite un coffre-fort de pxCVX Pounder, qui convertit les incitations sous-jacentes en davantage de pxCVX.
point-pirex-2: Pirex reverrouille automatiquement CVX en tant que vlCVX, à moins qu'un rachat ne soit initié.
point-pirex-3: Pirex maintient un pool de liquidités pxCVX/CVX pour l'échange instantané, généralement avec une décote.
point-pirex-4: Les pxCVX peuvent être échangés contre des CVX, car chaque pxCVX est garanti à hauteur de 1:1 par des CVX. Il existe une commission de rachat qui est inversement proportionnelle à la durée de déblocage.

description-union: En rejoignant l'Union, vous transmettez vos pots-de-vin à Llama Airforce, nous les réclamons collectivement, les échangeons tous contre des cvxCRV, les plaçons dans un auto-compoundeur et vous les envoyons par avion. et enfin, nous vous larguons les parts de pounder.

point-union-1: L'Union n'a pas la garde de vos CVX, vous restez maître de vos jetons.
point-union-2: Comme pour Votium, les récompenses sont cumulables et vous n'êtes pas obligé de les réclamer immédiatement. de les réclamer immédiatement.
point-union-3: Les récompenses larguées par avion s'accumulent automatiquement, même si elles ne sont pas réclamées.
point-union-4: En déléguant également à votium.eth, vous n'avez même pas à vous soucier de voter et de maximiser votre production. de voter et de maximiser votre production.

description-votium: Votium est une plateforme d'incitation où les détenteurs de vlCVX et de veCRV sont récompensés par des acheteurs à la recherche de liquidités importantes. Déléguer/voter ne comporte aucun risque pour vos fonds, car vous conservez toujours la garde de vos vlCVX et veCRV.

point-votium-1: Votium est une plateforme d'incitation où les détenteurs de vlCVX et de veCRV sont récompensés par des acheteurs à la recherche de liquidités importantes. Déléguer/voter ne comporte aucun risque pour vos fonds, car vous conservez toujours la garde de vos vlCVX et veCRV.
point-votium-2: Les titulaires de vlCVX sont libres d'accepter les primes d'encouragement à leur guise.
point-votium-3: Les récompenses sont reportées au tour suivant et il n'est pas nécessaire de les réclamer immédiatement. n'est pas nécessaire.
point-votium-4: La délégation à votium.eth automatise le vote pour le meilleur $ / vlCVX possible.
</i18n>
