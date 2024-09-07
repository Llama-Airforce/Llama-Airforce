<script setup lang="ts"></script>

<template>
  <div class="audits">
    <div class="audit">
      <a
        class="logo"
        href="https://omniscia.io/"
        target="_blank"
      >
        <img
          class="no-hover"
          src="@/Assets/Pirex/omniscia.png"
          alt="Omniscia"
        />
      </a>

      <a
        href="https://omniscia.io/pirex-multi-token-convex-wrapper/"
        target="_blank"
      >
        Report
      </a>
    </div>

    <div class="audit">
      <a
        class="logo"
        href="https://www.keyko.io/"
        target="_blank"
      >
        <img
          class="no-hover"
          src="@/Assets/Pirex/keyko.png"
          alt="Keyko"
        />
      </a>

      <a
        href="https://drive.google.com/file/d/151iyZSiFhHmdEaSu3w-3ba19NKaERexH/view?usp=sharing"
        target="_blank"
      >
        Report
      </a>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.audits {
  display: grid;
  width: 100%;
  grid-template-columns: 1fr 1fr;
  justify-items: center;

  .audit {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1rem;

    .logo {
      &:hover {
        background: unset;
      }
    }

    img {
      object-fit: cover;
      width: 12.5rem;
      height: 3.125rem;
    }
  }
}
</style>
