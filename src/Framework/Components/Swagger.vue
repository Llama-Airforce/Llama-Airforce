<script setup lang="ts">
import swaggerUIConstructor from "swagger-ui-dist/swagger-ui-bundle";
import "swagger-ui-dist/swagger-ui.css";

const { url } = defineProps<{
  url: string;
}>();

onMounted(() => {
  swaggerUIConstructor({
    dom_id: "#swagger-ui",
    url,
    deepLinking: true,
  });
});
</script>

<template>
  <div id="swagger-ui"></div>
</template>

<style scoped>
#swagger-ui {
  height: 100%;
  width: 100%;
}
</style>

<style>
.swagger-ui {
  --dark-filter: invert(calc(88% * max(0, var(--color-scheme-dark))))
    hue-rotate(calc(180deg * max(0, var(--color-scheme-dark))));

  filter: var(--dark-filter);
}

.swagger-ui .microlight,
.swagger-ui img {
  --dark-filter: invert(calc(100% * max(0, var(--color-scheme-dark))))
    hue-rotate(calc(180deg * max(0, var(--color-scheme-dark))));

  filter: var(--dark-filter);
}
</style>
