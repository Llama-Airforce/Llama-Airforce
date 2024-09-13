<script setup lang="ts"></script>

<template>
  <div class="logo">
    <div class="visual">
      <img src="@/Assets/Menu/crv.png" />
      <img src="@/Assets/Menu/hat.png" />
    </div>
    <span>curve.monitor</span>
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

.logo {
  display: flex;
  align-items: center;
  align-self: center;

  gap: 1rem;

  &:hover {
    .visual {
      animation: pulse 0.5s infinite;
    }
  }

  .visual {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 2.25rem;

    animation: pulse 2s infinite;

    img {
      position: absolute;
      height: 2.25rem;
      object-fit: contain;

      transform: translateY(var(--translate-mobile, 0rem));

      @media only screen and (max-width: 1280px) {
        --translate-mobile: 0.5rem;
      }

      &:nth-child(2) {
        transform: scale(0.75) translateX(-1rem)
          translateY(calc(-2rem + var(--translate-mobile, 0rem)))
          rotateZ(-20deg);
      }
    }
  }

  span {
    display: flex;
    font-size: 1.75rem;
    align-items: center;
  }
}
</style>
