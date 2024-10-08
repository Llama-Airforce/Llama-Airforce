<script setup lang="ts">
const { relativeTime } = useRelativeTime();

function go(url: string) {
  window.open(url, "_blank");
}
</script>

<template>
  <div class="articles">
    <div class="title">Articles</div>

    <div class="articles-cards">
      <Card
        class="border-special-hover"
        @click="go('https://blog.curvemonitor.com/posts/curve-users/')"
      >
        <div class="article">
          <div class="title">Who are Curve's Users?</div>
          <div class="description">
            A look at the differences between users of Curve's products
          </div>
          <div class="date">{{ relativeTime(1723586400) }}</div>
          <div class="read">
            <a
              href="https://blog.curvemonitor.com/posts/curve-users/"
              target="_blank"
            >
              Read now
            </a>
          </div>
        </div>
      </Card>

      <Card
        class="border-special-hover"
        @click="go('https://blog.curvemonitor.com/posts/exchange-received/')"
      >
        <div class="article">
          <div class="title">How to Do Cheaper, Approval-Free Swaps</div>
          <div class="description">
            A deep dive into the exchange_received function on NG pools which
            allows users to trade without approvals and can significantly reduce
            transaction gas costs.
          </div>
          <div class="date">{{ relativeTime(1711234800) }}</div>
          <div class="read">
            <a
              href="https://blog.curvemonitor.com/posts/exchange-received/"
              target="_blank"
            >
              Read now
            </a>
          </div>
        </div>
      </Card>

      <Card
        class="border-special-hover"
        @click="go('https://blog.curvemonitor.com/posts/ng-mev/')"
      >
        <div class="article">
          <div class="title">Impact of Dynamic Fees on MEV Activity</div>
          <div class="description">
            This post compares MEV activity on StableSwap NG pools and pools
            with the original implementation. It explains dynamic fees and their
            impact on certain types of MEV activity.
          </div>
          <div class="date">{{ relativeTime(1710025200) }}</div>
          <div class="read">
            <a
              href="https://blog.curvemonitor.com/posts/ng-mev/"
              target="_blank"
            >
              Read now
            </a>
          </div>
        </div>
      </Card>

      <Card
        class="border-special-hover"
        @click="go('https://blog.curvemonitor.com/posts/parameter-ramping/')"
      >
        <div class="article">
          <div class="title">Parameter Ramping</div>
          <div class="description">
            Why aren't parameter changes on Curve pools applied instantly? This
            post dwelves into the reasons behind gradual parameter changes.
          </div>
          <div class="date">{{ relativeTime(1707606000) }}</div>
          <div class="read">
            <a
              href="https://blog.curvemonitor.com/posts/parameter-ramping/"
              target="_blank"
            >
              Read now
            </a>
          </div>
        </div>
      </Card>
    </div>
  </div>
</template>

<style scoped>
.articles {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  > .title {
    font-size: 1.75rem;
    font-weight: bolder;

    @media only screen and (max-width: 825px) {
      font-size: 1.75rem;
    }
  }

  > .articles-cards {
    display: grid;
    gap: calc(1.25 * var(--dashboard-gap));
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    > .card {
      .article {
        min-height: 250px;
        line-height: 1.5;

        display: grid;
        gap: calc(0.5 * var(--dashboard-gap));
        grid-template-rows: 4em 1fr auto;
        grid-template-columns: 1fr auto;
        grid-template-areas:
          "title title"
          "description description"
          "date read";

        @media only screen and (max-width: 825px) {
          grid-template-rows: auto 1fr auto;
          min-height: unset;
        }

        > .title {
          grid-area: title;

          font-size: 1.125rem;
          font-weight: bold;
          text-wrap: balance;
          overflow: hidden;

          @media only screen and (max-width: 825px) {
            font-size: 1.125rem;
          }
        }

        > .description {
          grid-area: description;

          font-size: 1rem;
        }

        > .date {
          grid-area: date;

          opacity: 0.6;
        }

        > .read {
          grid-area: read;
        }
      }
    }
  }
}
</style>
