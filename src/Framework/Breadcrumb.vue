<template>
  <Card>
    <TransitionGroup
      name="fade"
      tag="ul"
    >
      <li
        v-for="crumb in crumbs"
        :key="crumb.id"
      >
        <component
          :is="isActive(crumb) ? 'span' : 'a'"
          :class="{ active: isActive(crumb) }"
          @click="emit('crumb', crumb)"
        >
          {{ crumb.label }}
        </component>

        <i
          v-if="!isLast(crumb) || crumbs.length === 1"
          class="fas fa-chevron-right"
        ></i>
      </li>
    </TransitionGroup>
  </Card>
</template>

<script setup lang="ts">
import { Card, type Crumb } from "@/Framework";

// Props
interface Props {
  crumbs: Crumb[];
  active?: Crumb;
}

const { crumbs, active } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  crumb: [crumb: Crumb];
}>();

// Methods
const isActive = (crumb: Crumb): boolean =>
  active ? active.id === crumb.id : crumbs.at(-1)?.id === crumb.id;

const isLast = (crumb: Crumb): boolean => crumbs.at(-1)?.id === crumb.id;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.75s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

ul {
  display: flex;
  gap: 1rem;

  padding: 0;
  margin: 0;
  list-style-type: none;
  user-select: none;
  overflow: hidden;

  > li {
    display: flex;
    align-items: center;
    gap: 1rem;
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
    }

    > a {
      &:hover {
        cursor: pointer;
      }
    }

    > i {
      font-size: 0.5rem;
    }
  }
}
</style>
