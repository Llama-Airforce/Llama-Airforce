<script setup lang="ts">
import { useStorage } from "@vueuse/core";
import { locales as localesAll, type Locale } from "@/Framework/Locale";

const STORAGE_LOCALE = "locale";

type Direction = "up" | "down";

const locale = useStorage<Locale>(STORAGE_LOCALE, "en");
const { locale: loc } = useI18n({ useScope: "global" });

const { locales = localesAll, direction = "up" } = defineProps<{
  locales?: Locale[];
  direction?: Direction;
}>();

// Hooks
onMounted(() => {
  onLocaleSelect(locale.value);
});

// Select
function onLocaleSelect(option: Locale) {
  locale.value = option;
  loc.value = locale.value;
}

function label(locale: Locale) {
  switch (locale) {
    case "en":
      return "English";
    case "fr":
      return "Français";
    case "zh":
      return "中文";
  }
}
</script>

<template>
  <Select
    :class="{ 'direction-up': direction === 'up' }"
    :options="locales.map((x) => x)"
    :selected="locale"
    @input="onLocaleSelect"
  >
    <template #item="{ item }">
      <div class="item">
        <div class="label">{{ label(item) }}</div>
      </div>
    </template>
  </Select>
</template>

<style lang="scss" scoped>
.item {
  display: flex;
  align-items: center;

  > .label {
    font-size: 0.875rem;
    margin-left: 0.75rem;
  }
}

.direction-up {
  :deep(.items) {
    bottom: 120%; /* Items will move upwards. */
  }
}
</style>
