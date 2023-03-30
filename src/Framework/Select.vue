<template>
  <div
    class="select-container"
    tabindex="0"
    @click.stop="emit('open')"
    @blur="emit('close')"
  >
    <!-- Selector -->
    <div class="select">
      <div
        class="selected"
        :class="{ open: open }"
      >
        <slot
          name="item"
          :item="(selected as never)"
        >
          <div class="item">{{ selected }}</div>
        </slot>
        <div
          v-if="label"
          class="label"
        >
          {{ label }}
        </div>
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

    <!-- Chevrons -->
    <div class="chevrons">
      <i class="fas fa-chevron-up"></i>
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
</template>

<script setup lang="ts">
// Props
interface Props {
  options?: unknown[];
  open?: boolean;
  selected?: unknown | null;
  label?: string;
}

const {
  options = [],
  open = false,
  selected = null,
  label,
} = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "open"): void;
  (e: "close"): void;
  (e: "input", option: unknown): void;
}>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.select-container {
  position: relative;
  display: flex;

  position: relative;
  cursor: pointer;
  user-select: none;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
  transition: background $hover-duration;
  background: var(--c-lvl1-hover);
  box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);
  padding: 0.4rem 0.75rem;

  &:hover {
    background: var(--c-lvl1-active);
  }

  .chevrons {
    position: absolute;
    display: flex;
    flex-direction: column;
    font-size: 0.75rem;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }

  .select {
    display: flex;
    flex-direction: column;
    flex-grow: 1;

    width: 100%;
    text-align: left;
    outline-color: transparent;
    line-height: 1.5rem;

    > .selected {
      display: flex;
      flex-direction: column;
      flex-grow: 1;
      justify-content: center;

      > .label {
        color: #a1a1aa;
        font-size: 0.75rem;
      }
    }

    > .items {
      color: #fff;
      overflow: hidden;
      position: absolute;
      right: 10px;
      left: 0;
      z-index: 15;
      line-height: 1.5rem;
      margin-top: 2rem;
      width: 100%;
      font-size: 1rem;

      background: linear-gradient(0deg, var(--c-lvl1), var(--c-lvl1)),
        var(--c-lvl0);
      box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.4);

      > div {
        color: #fff;
        cursor: pointer;
        -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
        user-select: none;
        border-bottom: 1px solid var(--c-lvl4);
        padding: 0.4rem 0.75rem;

        &:hover {
          background-color: var(--c-primary);
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
}
</style>
