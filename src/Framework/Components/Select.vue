<script setup lang="ts" generic="T">
const {
  options,
  selected,
  label,
  chevrons = true,
  direction = "down",
} = defineProps<{
  options: T[];
  selected: T;
  label?: string;
  chevrons?: boolean;
  direction?: "up" | "down";
}>();

const emit = defineEmits<{
  select: [option: T];
}>();

const open = ref(false);

function onSelect(option: T) {
  open.value = false;

  emit("select", option);
}
</script>

<template>
  <div
    tabindex="0"
    class="select"
    :class="[{ open, chevrons }, direction]"
    @blur="open = false"
    @click.stop="open = !open"
  >
    <div class="selected">
      <div class="option-wrapper">
        <slot
          name="option"
          :option="selected"
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

    <OptionsList
      v-model:open="open"
      :direction
      :options
      @select="onSelect"
    >
      <template #option="{ option }">
        <slot
          name="option"
          :option
          :is-selected="false"
        >
          {{ option }}
        </slot>
      </template>
    </OptionsList>

    <div class="chevrons">
      <LucideChevronsLeftRight />
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

  &.open:not(&.up) {
    border-bottom-left-radius: 0px;
    border-bottom-right-radius: 0px;
  }

  &:has(.selected:hover) {
    background-color: hsl(
      from var(--c-background) h s calc(l + 12 * var(--color-scheme-dark))
    );
  }

  > .selected {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    cursor: pointer;

    > .option-wrapper {
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

  &:not(.chevrons) {
    > .chevrons {
      display: none;
    }
  }

  > .chevrons {
    position: absolute;
    pointer-events: none;
    right: 1.25rem;
    top: 50%;

    .lucide {
      width: 1.125rem;
      height: 1.125rem;
      rotate: 90deg;
      translate: 50% -50%;
    }
  }
}
</style>
