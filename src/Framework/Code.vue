<template>
  <div v-html="html"></div>
</template>

<script setup lang="ts">
import { createHighlighterCore, makeSingletonHighlighterCore } from "shiki";

const createHighlighter = makeSingletonHighlighterCore(createHighlighterCore)({
  themes: [import("shiki/themes/dark-plus.mjs")],
  langs: [
    import("shiki/langs/vue.mjs"),
    import("shiki/langs/html.mjs"),
    import("shiki/langs/scss.mjs"),
    import("shiki/langs/typescript.mjs"),
    () => import("shiki/langs/css.mjs"),
  ],
  loadWasm: import("shiki/wasm"),
});

// Props
interface Props {
  lang: "vue" | "html" | "scss" | "typescript";
  code: string;
}

const { lang, code } = defineProps<Props>();

// Refs
const html = computedAsync(async () => {
  const highlighter = await createHighlighter;

  return highlighter.codeToHtml(code, { lang, theme: "dark-plus" });
});
</script>

<style lang="scss">
pre {
  padding: 1.5rem;
}
</style>
