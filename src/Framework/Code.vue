<script setup lang="ts">
import { createHighlighterCore, makeSingletonHighlighterCore } from "shiki";

const createHighlighter = makeSingletonHighlighterCore(createHighlighterCore)({
  themes: [import("shiki/themes/dark-plus.mjs")],
  langs: [
    () => import("shiki/langs/vue.mjs"),
    () => import("shiki/langs/html.mjs"),
    () => import("shiki/langs/css.mjs"),
    () => import("shiki/langs/typescript.mjs"),
  ],
  loadWasm: import("shiki/wasm"),
});

const { lang, code } = defineProps<{
  lang: "vue" | "html" | "css" | "typescript";
  code: string;
}>();

const html = ref("");

watch(
  [() => code, () => lang],
  async ([code, lang]) => {
    const highlighter = await createHighlighter;

    html.value = highlighter.codeToHtml(code, { lang, theme: "dark-plus" });
  },
  { immediate: true }
);
</script>

<template>
  <div v-html="html"></div>
</template>

<style>
pre {
  padding: 1.5rem;
}
</style>
