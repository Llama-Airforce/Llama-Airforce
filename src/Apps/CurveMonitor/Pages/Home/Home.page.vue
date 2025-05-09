<script setup lang="ts">
import Articles from "./Components/Articles.vue";
import KPIs from "./Components/KPIs.vue";
import Telegram from "./Components/Telegram.vue";
</script>

<template>
  <div class="dashboard">
    <div class="description">
      <span class="title">Curve Monitor</span>
      <span class="tag">
        Airdropping knowledge bombs about the Curve ecosystem.
      </span>
    </div>

    <img
      class="llama"
      src="@/Assets/llama-cloud-transparant.png"
    />

    <div class="highlights">
      <KPIs />
      <Telegram />
    </div>

    <Articles style="grid-area: articles" />
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 3fr 1fr;
  grid-template-areas:
    "description llama"
    "highlights llama"
    "articles articles";

  gap: calc(3 * var(--dashboard-gap));

  @media only screen and (max-width: 1280px) {
    display: grid;
    margin-inline: calc(0.5 * var(--page-margin));
    gap: calc(2 * var(--dashboard-gap));

    grid-template-areas:
      "description description"
      "highlights highlights"
      "articles articles";

    > .description {
      justify-content: center;
    }
  }

  > .description {
    grid-area: description;

    display: flex;
    flex-direction: column;
    gap: 1ch;

    > .title {
      font-size: 3.5rem;
      font-weight: bold;

      @media only screen and (max-width: 825px) {
        font-size: 2.5rem;
      }
    }

    > .tag {
      font-size: 1.5rem;
      opacity: 0.9;

      @media only screen and (max-width: 825px) {
        max-width: 400px;
      }

      @media only screen and (max-width: 600px) {
        max-width: 300px;
      }
    }
  }

  > .highlights {
    grid-area: highlights;

    container-type: inline-size;

    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: calc(1.25 * var(--dashboard-gap));

    @media only screen and (max-width: 825px) {
      display: flex;
      flex-direction: column;
    }
  }

  > .llama {
    grid-area: llama;
    text-align: center;

    min-width: 200px;
    max-width: 300px;
    max-height: 400px;

    object-fit: cover;
    align-self: center;
    border-radius: 10%;

    animation: float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

    @media only screen and (max-width: 1280px) {
      grid-area: description;
      justify-self: end;
      z-index: -1;
      min-width: min-content;
      max-height: 200px;
    }

    @media only screen and (max-width: 825px) {
      opacity: 0.25;
    }

    @media only screen and (max-width: 600px) {
      max-height: 150px;
    }
  }
}
</style>
