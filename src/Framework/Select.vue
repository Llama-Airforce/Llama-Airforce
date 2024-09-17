<script setup lang="ts" generic="T">
const { options, selected, label } = defineProps<{
  options: T[];
  selected: T;
  label?: string;
}>();

const emit = defineEmits<{
  input: [option: T];
}>();

// Refs
const open = ref(false);
</script>

<template>
  <div
    tabindex="0"
    class="select"
    :class="{ open }"
    @blur="open = false"
    @click.stop="open = !open"
  >
    <div class="selected">
      <div class="item-wrapper">
        <slot
          name="item"
          :item="selected"
          :is-selected="true"
        >
          {{ selected }}
        </slot>
      </div>

      <div
        v-if="label"
        class="label"
      >
        {{ label }}
      </div>
    </div>

    <div
      class="items"
      :class="{ open }"
    >
      <div
        v-for="(option, i) of options"
        :key="i"
        class="item-wrapper"
        @click.stop="
          open = false;
          emit('input', option);
        "
      >
        <slot
          name="item"
          :item="option"
          :is-selected="false"
        >
          {{ option }}
        </slot>
      </div>
    </div>

    <div class="chevrons">
      <i class="fas fa-chevron-up"></i>
      <i class="fas fa-chevron-down"></i>
    </div>
  </div>
</template>

<style scoped>
.select {
  --c-background: var(--c-lvl1);

  position: relative;

  user-select: none;

  /* Disable blue highlight because of pointer. */
  -webkit-tap-highlight-color: transparent;

  transition: background-color 125ms ease;
  background: hsl(
    from var(--c-background) h s calc(l + 6 * var(--color-scheme-dark))
  );
  border-radius: var(--border-radius);
  box-shadow: var(--select-box-shadow);

  outline-color: transparent;
  line-height: 1.5rem;

  &.open:not(&.direction-up) {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  &.direction-up {
    > .items {
      bottom: 120%; /* Items will move upwards. */
    }
  }

  > .selected {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;

    &:hover {
      background: hsl(
        from var(--c-background) h s calc(l + 12 * var(--color-scheme-dark))
      );
    }

    > .item-wrapper {
      margin: 0.5rem 0.75rem;
    }

    > .label {
      color: var(--c-lvl5);
      font-size: 0.75rem;
      line-height: 1.5;
      margin-inline: 0.75rem;
      margin-bottom: 0.5rem;
    }
  }

  > .items {
    color: var(--c-text);
    overflow: hidden;
    position: absolute;
    left: 0;
    z-index: 1;
    min-width: var(--select-items-min-width, 100%);
    font-size: 1rem;

    background: var(--c-lvl1);
    box-shadow: var(--select-items-box-shadow);
    border-bottom-left-radius: var(--border-radius);
    border-bottom-right-radius: var(--border-radius);

    &:not(.open) {
      display: none;
    }

    > .item-wrapper {
      color: var(--c-text);
      cursor: pointer;

      /* Disable blue highlight because of pointer. */
      -webkit-tap-highlight-color: transparent;
      user-select: none;
      border-bottom: 1px solid var(--c-lvl3);
      padding: 0.5rem 0.75rem;

      &:hover {
        background-color: var(--c-primary);
      }
    }

    > div:last-child {
      border-bottom: 0;
      border-bottom-left-radius: var(--border-radius);
      border-bottom-right-radius: var(--border-radius);
    }
  }

  > .chevrons {
    position: absolute;
    display: flex;
    flex-direction: column;
    font-size: 0.625rem;
    right: 1rem;
    top: 50%;
    transform: translateY(-50%);
  }
}
</style>
