<template>
  <div class="home">
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

    <KPIs style="grid-area: kpis"></KPIs>
    <Articles style="grid-area: articles"></Articles>
  </div>
</template>

<script setup lang="ts">
import KPIs from "@CM/Pages/Home/Components/KPIs.vue";
import Articles from "@CM/Pages/Home/Components/Articles.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 3fr minmax(400px, 1fr);
  grid-template-areas:
    "description llama"
    "kpis llama"
    "articles articles";

  padding-inline: calc(3 * var(--page-margin));
  gap: calc(3 * var(--dashboard-gap));

  @media only screen and (max-width: 1280px) {
    display: grid;
    padding-inline: var(--page-margin);
    gap: calc(2 * var(--dashboard-gap));

    grid-template-areas:
      "description description"
      "kpis kpis"
      "articles articles";

    > .description {
      justify-content: center;
    }
  }

  > .description {
    grid-area: description;

    display: flex;
    flex-direction: column;
    gap: 2ch;

    > .title {
      font-size: 3.5rem;
      font-weight: bold;
    }

    > .tag {
      font-size: 1.5rem;
      opacity: 0.9;

      @media only screen and (max-width: 800px) {
        max-width: 400px;
      }

      @media only screen and (max-width: 600px) {
        max-width: 300px;
      }
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

    @media only screen and (max-width: 800px) {
      opacity: 0.25;
    }

    @media only screen and (max-width: 600px) {
      max-height: 150px;
    }

    @keyframes float {
      0% {
        transform: translate(0, 0) rotate(0deg);
      }
      33% {
        transform: translate(5px, -8px) rotate(2deg);
      }
      66% {
        transform: translate(-5px, -4px) rotate(-1deg);
      }
      100% {
        transform: translate(0, 0) rotate(0deg);
      }
    }
  }
}
</style>
