<template>
  <ul>
    <li
      :class="{ active: page === 1 }"
      @click="onPage(1)"
    >
      <button>1</button>
    </li>

    <li
      v-if="pages > 2"
      @click="prev"
    >
      <button>
        <i class="fas fa-chevron-left"></i>
      </button>
    </li>

    <li
      v-for="p in pageButtons"
      :key="p"
      :class="{ active: p === page }"
      @click="onPage(p)"
    >
      <button>{{ p }}</button>
    </li>

    <li
      v-if="pages > 2"
      @click="next"
    >
      <button><i class="fas fa-chevron-right"></i></button>
    </li>

    <li
      v-if="pages > 1"
      :class="{ active: page === pages }"
      @click="onPage(pages)"
    >
      <button>{{ pages }}</button>
    </li>
  </ul>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";

// Props
interface Props {
  page: number;
  itemsCount: number;
  itemsPerPage: number;
}

const { page, itemsCount, itemsPerPage } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "page", page: number): void;
}>();

// Refs
const pages = $computed(() => {
  return Math.ceil(itemsCount / itemsPerPage);
});

const pageButtons = $computed(() => {
  const rangeSize = 5;
  const rangeSizeScan = rangeSize + 1;
  const range = [...Array(rangeSizeScan * 2).keys()]
    .map((x) => x - rangeSizeScan + page)
    .filter((x) => x >= 1 && x <= pages);

  const i = range.findIndex((x) => x === page);
  const left = [];
  const right = [];
  const middle = page !== 1 && page !== pages ? [page] : [];

  let j = 1;
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const l = range[i - j];
    if (l && l !== 1) {
      left.unshift(l);
    }

    if (
      left.length + right.length + middle.length >= rangeSize ||
      j > range.length
    ) {
      break;
    }

    const r = range[i + j];
    if (r && r !== pages) {
      right.push(r);
    }

    j++;

    if (
      left.length + right.length + middle.length >= rangeSize ||
      j > range.length
    ) {
      break;
    }
  }

  return [...left, ...middle, ...right];
});

// Methods
const clamp = (x: number, min: number, max: number): number => {
  return Math.min(Math.max(x, min), max);
};

const prev = () => emit("page", clamp(page - 1, 1, pages));
const next = () => emit("page", clamp(page + 1, 1, pages));
const onPage = (p: number) => emit("page", clamp(p, 1, pages));
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

ul {
  display: flex;
  padding: 0;
  margin: 0;
  list-style-type: none;

  > li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &.active {
      button {
        background-color: $blue;
      }
    }

    > button {
      all: unset;
      display: flex;
      justify-content: center;
      align-items: center;

      height: 2.5rem;
      width: 2.5rem;

      cursor: pointer;
      background-color: transparent;
      border: none;

      &:hover {
        background-color: lighten($blue, 10%);
      }

      &:active {
        background-color: lighten($blue, 20%);
      }
    }
  }

  > li:first-child {
    margin-right: 0.25rem;
  }

  > li:nth-child(2) {
    margin-right: 1rem;
    background: #303034;
  }

  > li:nth-last-child(2) {
    margin-left: 1rem;
    background: #303034;
  }

  > li:last-child {
    margin-left: 0.25rem;
  }
}
</style>
