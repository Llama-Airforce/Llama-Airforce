<template>
  <div class="articles">
    <div class="title">Articles</div>

    <div class="articles-cards">
      <Card @click="go('https://blog.curvemonitor.com/posts/curve-users/')">
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

      <Card @click="go('https://blog.curvemonitor.com/posts/ng-mev/')">
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

<script setup lang="ts">
const { relativeTime } = useRelativeTime();

function go(url: string) {
  window.open(url, "_blank");
}
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.articles {
  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  > .title {
    font-size: 1.875rem;
    font-weight: bolder;

    @media only screen and (max-width: 825px) {
      font-size: 1.75rem;
    }
  }

  > .articles-cards {
    display: grid;
    gap: var(--dashboard-gap);
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));

    > .card {
      .article {
        min-height: 300px;
        line-height: 1.5;

        display: grid;
        gap: var(--dashboard-gap);
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

          font-size: 1.375rem;
          font-weight: bold;
          text-wrap: balance;
          overflow: hidden;

          @media only screen and (max-width: 825px) {
            font-size: 1.25rem;
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

      &::before,
      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        top: 50%;
        left: 50%;
        translate: -50% -50%;
        z-index: -1;
        padding: 3px;
        border-radius: calc(var(--border-radius) + 3px);

        background-image: conic-gradient(
          from var(--angle),
          var(--c-card-special-1),
          var(--c-card-special-2),
          var(--c-card-special-1)
        );

        animation: 2s spin linear infinite;

        transition: opacity $hover-duration linear;
        opacity: 0;

        @keyframes spin {
          from {
            --angle: 0deg;
          }

          to {
            --angle: 360deg;
          }
        }
      }

      &::after {
        filter: blur(5px);

        transition: opacity $hover-duration linear;
        opacity: 0;
      }

      &:hover {
        cursor: pointer;

        &::before {
          opacity: 1;
        }

        &::after {
          opacity: 0.5;
        }
      }
    }
  }
}
</style>
