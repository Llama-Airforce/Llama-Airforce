<template>
  <HighlightJS
    :language="lang"
    :code="codeFinal"
  >
  </HighlightJS>

  <slot v-if="false"></slot>
</template>

<script setup lang="ts">
import { useSlots } from "vue";
import { $computed } from "vue/macros";
import hljsVuePlugin from "@highlightjs/vue-plugin";

const HighlightJS = hljsVuePlugin.component;

// Props
interface Props {
  lang: "xml" | "scss" | "typescript";
  code?: string;
}

const { lang, code } = defineProps<Props>();

// Refs
const slots = useSlots();

const codeFinal = $computed(function () {
  if (slots.default) {
    const children = slots.default()[0].children;
    return children as string;
  }

  return code ?? "";
});
</script>
