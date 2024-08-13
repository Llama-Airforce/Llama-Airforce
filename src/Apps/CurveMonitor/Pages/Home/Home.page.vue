<template>
  <div class="home">
    <div class="description">
      <span class="title">Curve Monitor</span>
      <span class="tag">
        Airdropping knowledge bombs about the Curve ecosystem.
      </span>
    </div>

    <KPIs style="grid-area: kpis"></KPIs>

    <img
      class="llama"
      src="@/Assets/llama-cloud-transparant.png"
    />
  </div>
</template>

<script setup lang="ts">
import KPIs from "@CM/Pages/Home/Components/KPIs.vue";
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("home");

.home {
  max-width: calc(1920px - 18.125rem);

  grid-template-columns: 3fr minmax(400px, 1fr);
  grid-template-areas:
    "description llama"
    "kpis llama";

  padding-inline: calc(3 * var(--page-margin));
  gap: calc(4 * var(--dashboard-gap));

  @media only screen and (max-width: 1280px) {
    display: grid;
    padding-inline: var(--page-margin);
    gap: calc(2 * var(--dashboard-gap));

    grid-template-areas:
      "description llama"
      "kpis kpis";

    > .description {
      justify-content: center;
    }
  }

  > .description {
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
  }
}
</style>
