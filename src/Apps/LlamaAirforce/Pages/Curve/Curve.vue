<template>
  <div class="curve">
    <div class="logo">
      <div class="visual">
        <img src="@/Assets/crv.png" />
        <img src="@/Assets/hat.png" />
      </div>
      <a href="https://curvemonitor.com">curve.monitor</a>
    </div>

    <div class="info">
      Our Curve dashboards have moved! They've now got their own dedicated
      website. Still under construction though, but getting cooler by the day!
      You can find them over at
      <a href="https://curvemonitor.com">https://curvemonitor.com</a>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

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

.curve {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding-top: 5rem;
  gap: 5rem;

  > .info {
    width: 50%;
    font-size: 1.25rem;
    text-align: center;

    @media only screen and (max-width: 1280px) {
      width: 75%;
    }
  }

  > .logo {
    display: flex;
    align-items: center;
    align-self: center;

    gap: 1rem;

    transform: scale(1.5);

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

        @media only screen and (max-width: 1280px) {
          --translate-mobile: 0.5rem;
        }

        transform: translateY(var(--translate-mobile, 0rem));

        &:nth-child(2) {
          transform: scale(0.75) translateX(-1rem)
            translateY(calc(-2rem + var(--translate-mobile, 0rem)))
            rotateZ(-20deg);
        }
      }
    }

    a {
      display: flex;
      font-size: 1.75rem;
      align-items: center;
      color: var(--c-text);
    }
  }
}
</style>
