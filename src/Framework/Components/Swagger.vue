<script setup lang="ts">
const { url } = defineProps<{
  url: string;
}>();

onMounted(() => {
  // Load CSS
  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = "https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui.css";
  document.head.appendChild(link);

  // Load JS
  const script = document.createElement("script");
  script.src = "https://unpkg.com/swagger-ui-dist@5.18.2/swagger-ui-bundle.js";
  script.onload = () => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call, @typescript-eslint/no-unsafe-member-access, @typescript-eslint/no-explicit-any
    (window as any).SwaggerUIBundle({
      dom_id: "#swagger-ui",
      url,
      deepLinking: true,
    });
  };
  document.body.appendChild(script);
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
