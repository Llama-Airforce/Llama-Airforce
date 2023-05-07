<template>
  <Select
    class="select direction-up"
    :options="themes.map((x) => x)"
    :selected="theme"
    :open="selectThemeOpen"
    @open="onThemeOpen"
    @close="selectThemeOpen = false"
    @input="onThemeSelect"
  >
    <template #item="props: { item: ThemeDescription }">
      <div class="theme">
        <div class="label">{{ props.item.id }}</div>
        <div class="colors">
          <div
            class="color"
            :style="{ 'background-color': props.item.colors.backgroundColor }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.level1 }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.level2 }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.blue }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.yellow }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.green }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.red }"
          ></div>

          <div
            class="color"
            :style="{ 'background-color': props.item.colors.purple }"
          ></div>
        </div>
      </div>
    </template>
  </Select>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { Select } from "@/Framework";
import { getColors } from "@/Styles/Themes/CM";
import { Theme } from "@CM/Models/Theme";
import { useCurveMonitorStore } from "@CM/Store";

type ThemeDescription = {
  id: Theme;
  colors: ReturnType<typeof getColors>;
};

const themes: ThemeDescription[] = [
  { id: "chad", colors: getColors("chad") },
  { id: "dark", colors: getColors("dark") },
  { id: "light", colors: getColors("light") },
];

// Refs
const store = useCurveMonitorStore();

const theme = ref<ThemeDescription>(themes[0]);
const selectThemeOpen = ref(false);

// Hooks
onMounted(() => {
  /*
   * Set theme to dark mode if browser is in dark mode.
   * Except if localstorage says otherwise, though.
   */
  const browserDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  const savedTheme = localStorage.getItem("theme");

  if (!savedTheme && browserDark) {
    onThemeSelect(themes.find((theme) => theme.id === "dark"));
  } else {
    const theme =
      themes.find((theme) => theme.id === savedTheme) ??
      themes.find((theme) => theme.id === "light") ??
      themes[0];

    onThemeSelect(theme);
  }
});

// Events
const onThemeOpen = (): void => {
  selectThemeOpen.value = !selectThemeOpen.value;
};

const onThemeSelect = (option: unknown) => {
  theme.value = option as ThemeDescription;

  window.document.documentElement.setAttribute("data-theme", theme.value.id);
  store.theme = theme.value.id;
  localStorage.setItem("theme", theme.value.id);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

::v-deep(.select) {
  .theme {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 1rem;

    height: auto;
    border: solid 1px transparent;

    &.active {
      border: solid 1px var(--c-primary);
    }

    > .label {
      margin-left: 0.75rem;
      text-transform: capitalize;
    }

    > .colors {
      display: flex;
      margin-right: 0.75rem;

      > .color {
        height: 0.75rem;
        width: 0.75rem;
        border: solid 1.5px black;
        border-radius: 50%;
        display: inline-block;
        margin: 0 -0.125rem;

        &:first-child {
          margin: 0 -0.125rem 0 0;
        }
      }
    }
  }
}

.direction-up {
  ::v-deep(.select) {
    > .items {
      bottom: 120%; // Items will move upwards.
    }
  }
}
</style>
