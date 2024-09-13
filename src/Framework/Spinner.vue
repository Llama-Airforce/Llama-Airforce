<template>
  <div class="spinner">
    <div></div>
    <div></div>
  </div>
</template>

<style scoped>
.spinner {
  display: inline-block;
  position: relative;
  width: 80px;
  height: 80px;

  div {
    position: absolute;
    border: 4px solid var(--c-text);
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }

  div:nth-child(2) {
    animation-delay: -0.5s;
  }

  &:not(&.loading) {
    animation-name: fadeOutSpinner;
    animation-duration: var(--hover-duration);
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }

  &.loading {
    animation-name: fadeInSpinner;
    animation-duration: var(--hover-duration);
    animation-fill-mode: forwards;
    animation-timing-function: ease-in-out;
  }
}

@keyframes fadeInSpinner {
  from {
    visibility: visible;
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes fadeOutSpinner {
  from {
    opacity: 1;
  }
  to {
    opacity: 0;
    visibility: hidden;
  }
}

@keyframes lds-ripple {
  0% {
    top: 36px;
    left: 36px;
    width: 0;
    height: 0;
    opacity: 1;
  }
  100% {
    top: 0px;
    left: 0px;
    width: 72px;
    height: 72px;
    opacity: 0;
  }
}
</style>
