<script setup lang="ts">
const router = useRouter();
</script>

<template>
  <div class="telegram">
    <Card
      :compact="true"
      @click="router.push('/telegram')"
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
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@property --angle {
  syntax: "<angle>";
  initial-value: 0deg;
  inherits: false;
}

.telegram-card {
  display: grid;
  grid-template-columns: auto 1fr;
  gap: calc(2 * var(--dashboard-gap));
  margin: calc(2 * var(--card-margin-block)) calc(2 * var(--card-margin-inline));

  place-content: center;
  place-items: center;

  > .info {
    font-size: 1.25rem;
    text-align: center;
  }

  > picture {
    position: relative;
    animation: float 12s cubic-bezier(0.45, 0.05, 0.55, 0.95) infinite;

    width: 80px;
    height: 80px;

    > img {
      height: 80px;
      object-fit: cover;
      align-self: center;
    }

    &::after {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: calc(50%);
      translate: -50% -50%;
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

.telegram {
  :deep(> .card) {
    .card-body {
      position: relative;
      padding: var(--card-margin-inline) var(--card-margin-block);

      &::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background-color: var(--c-blue);
        border-radius: var(--border-radius);
        opacity: 0.2; // Adjust this value to control the intensity of the overlay
        pointer-events: none;
      }
    }
  }

  > .card {
    height: 100%;
    cursor: pointer;

    &::before,
    &::after {
      --padding: 3px;

      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      top: 50%;
      left: calc(50% + 0.5px);
      translate: -50% -50%;
      z-index: -1;
      padding: var(--padding);
      border-radius: calc(var(--border-radius) + var(--padding));

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
      filter: blur(5px);

      transition: opacity $hover-duration linear, filter 0.3s ease;
      opacity: 0;
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

@keyframes spin {
  from {
    --angle: 0deg;
  }

  to {
    --angle: 360deg;
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
