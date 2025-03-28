<script setup lang="ts">
import TelegramModal from "./TelegramModal.vue";

const showModal = ref(false);
</script>

<template>
  <div class="telegram">
    <Card
      class="border-special"
      @click="showModal = true"
    >
      <div class="telegram-card">
        <picture>
          <img
            class="llama"
            src="@/Assets/Icons/telegram.webp"
          />
        </picture>

        <div class="info">
          Try our <strong>Telegram</strong> bots and monitor channels to get
          notified about the latest liquidations and events.
        </div>
      </div>
    </Card>

    <TelegramModal
      :show="showModal"
      @close="showModal = false"
    />
  </div>
</template>

<style scoped>
.telegram-card {
  height: 100%;
  display: grid;
  grid-template-columns: auto 1fr;
  gap: calc(2 * var(--dashboard-gap));
  margin-inline: var(--card-margin-inline);

  place-content: center;
  place-items: center;

  @container (width < 1000px) {
    grid-template-columns: 1fr;
    margin: var(--card-margin-block) var(--card-margin-inline);
  }

  @media only screen and (max-width: 1280px) {
    gap: calc(1.5 * var(--dashboard-gap));
  }

  > .info {
    font-size: 1.25rem;
    text-align: center;
  }

  > picture {
    position: relative;
    animation: float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

    --size: 80px;
    width: var(--size);
    height: var(--size);

    @media only screen and (max-width: 1280px) {
      --size: 60px;
    }

    > img {
      height: var(--size);
      object-fit: cover;
      align-self: center;
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      inset: 0;
      z-index: -1;
      border-radius: 50%;

      filter: blur(5px);
      transition: filter 0.3s ease;

      background-image: conic-gradient(
        from var(--angle),
        #7ebffc,
        #42a1fa,
        #7ebffc
      );

      animation: 2s spin linear infinite,
        3s shimmer ease-in-out infinite alternate;
    }
  }
}

.telegram {
  position: relative;
  cursor: pointer;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    background-color: var(--c-blue);
    border-radius: var(--border-radius);
    opacity: 0.2; /* Adjust this value to control the intensity of the overlay */
    pointer-events: none;
  }

  .card {
    height: 100%;

    &::before,
    &::after {
      background-image: conic-gradient(
        from var(--angle),
        #7ebffc,
        #42a1fa,
        #7ebffc
      );

      animation: 2s spin linear infinite,
        3s shimmer ease-in-out infinite alternate;
    }

    &::after {
      transition: opacity var(--hover-duration) linear, filter 0.3s ease;
    }

    &:hover {
      &:after {
        filter: blur(8px);
      }

      picture::after {
        filter: blur(8px);
        transition: filter 0.3s ease;
      }
    }
  }
}

@keyframes shimmer {
  0% {
    opacity: 0.8;
  }
  100% {
    opacity: 1;
  }
}
</style>
