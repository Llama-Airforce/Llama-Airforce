<template>
  <header class="header">
    <slot></slot>
  </header>
</template>

<style scoped>
header {
  display: grid;
  gap: 1rem;
  padding: 1rem var(--page-margin);

  background-color: var(--c-lvl0);
  border-bottom: 1px solid var(--c-lvl1);

  @media only screen and (max-width: 1280px) {
    display: none;
  }
}
</style>
