<script setup lang="ts"></script>

<template>
  <Card class="border-special">
    <div class="list">
      <img src="@/Assets/llama-cloud-transparant.png" />

      <div class="title">Stables</div>

      <div class="description">
        A collection of the biggest well known stablecoins.
      </div>

      <div class="assets">
        <ul>
          <li>
            <TokenIcon
              address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            ></TokenIcon>
            USDT
          </li>

          <li>
            <TokenIcon
              address="0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48"
            ></TokenIcon>
            USDC
          </li>

          <li>
            <TokenIcon
              address="0x6b175474e89094c44da98b954eedeac495271d0f"
            ></TokenIcon>
            DAI
          </li>
        </ul>
      </div>
    </div>
  </Card>
</template>

<style scoped>
.list {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  min-height: 100px;
  line-height: 1.5;

  img {
    max-width: 75px;
  }

  .assets {
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

        display: flex;
        align-items: center;
        gap: 1ch;

        &::marker {
          color: var(--c-primary);
        }
      }

      .token {
        max-width: 26px;
      }
    }
  }
}
</style>
