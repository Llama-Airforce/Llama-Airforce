<template>
  <div class="custom-select">
    <div
      class="selected"
      :class="{ open: open }"
    >
      <slot
        name="item"
        :item="(selected as never)"
      >
        {{ selected }}
      </slot>
    </div>

    <div
      class="items"
      :class="{ selectHide: !open }"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        @click="emit('input', option)"
      >
        <slot
          name="item"
          :item="(option as never)"
        >
          {{ option }}
        </slot>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  options?: unknown[];
  open?: boolean;
  selected?: unknown | null;
}

const { options = [], open = false, selected = null } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "input", option: unknown): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.custom-select {
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  line-height: 1.5rem;

  > .selected {
    cursor: pointer;
    -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
    user-select: none;
  }

  > .items {
    color: #fff;
    overflow: hidden;
    position: absolute;
    left: -0.75rem;
    right: 0;
    z-index: 1;
    line-height: 1.75rem;
    margin-top: 2.25rem;
    width: 15.75rem;

    background: linear-gradient(0deg, $level1-color, $level1-color), $background-color;
    box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

    > div {
      color: #fff;
      cursor: pointer;
      -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
      user-select: none;
      border-bottom: 1px solid $level4-color;
      padding: 0.5rem 0.75rem;

      &:hover {
        background-color: $blue;
      }
    }

    > div:last-child {
      border-bottom: 0;
    }
  }

  .selectHide {
    display: none;
  }
}
</style>
