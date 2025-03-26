<script setup lang="ts">
import type { Crumb } from "@/types/crumb";

const { crumbs, active } = defineProps<{
  crumbs: Crumb[];
  active?: Crumb;
}>();

const emit = defineEmits<{
  crumb: [crumb: Crumb];
}>();

// Methods
const isActive = (crumb: Crumb): boolean => {
  const idMatch = active
    ? active.id === crumb.id
    : crumbs.filter((crumb) => !crumb.hint).at(-1)?.id === crumb.id;

  return crumb.hint ?? idMatch;
};

const isFirst = (crumb: Crumb): boolean => crumbs.at(0)?.id === crumb.id;
</script>

<template>
  <TransitionGroup
    name="fade"
    tag="ul"
  >
    <li
      v-for="crumb in crumbs"
      :key="crumb.id"
    >
      <LucideChevronRight v-if="!isFirst(crumb)" />

      <component
        :is="isActive(crumb) ? 'span' : 'a'"
        :class="{ active: isActive(crumb), hint: crumb.hint }"
        @click="emit('crumb', crumb)"
      >
        {{ crumb.label }}
      </component>
    </li>
  </TransitionGroup>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

ul {
  --crumb-gap: 0.5rem;

  display: flex;
  flex-wrap: wrap;
  gap: var(--crumb-gap);

  padding: 0;
  margin: 0;
  list-style-type: none;
  user-select: none;
  overflow: hidden;

  > li {
    display: flex;
    align-items: center;
    gap: var(--crumb-gap);
    overflow: hidden;

    > a,
    > span {
      padding: 0 0.25rem;

      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;

      &:not(:hover) {
        color: var(--c-text);
        opacity: 0.5;
      }

      &.active {
        opacity: 1;
      }

      &.hint {
        opacity: 0.5;
        font-style: italic;
      }
    }

    > a {
      &:hover {
        cursor: pointer;
      }
    }

    > .lucide {
      width: 1rem;
      padding-top: 0.125rem;
      opacity: 50%;
    }
  }
}
</style>
