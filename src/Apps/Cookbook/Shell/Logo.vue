<template>
  <div class="logo">
    <div class="visual">
      <img src="/cookbook.png" />
    </div>
  </div>
</template>

<style scoped>
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
    }
  }

  span {
    display: flex;
    font-size: 1.75rem;
    align-items: center;
  }
}
</style>
