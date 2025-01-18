<script setup lang="ts">
const { page, itemsCount, itemsPerPage } = defineProps<{
  page: number;
  itemsCount: number;
  itemsPerPage: number;
}>();

const emit = defineEmits<{
  page: [page: number];
}>();

const pages = computed(() => {
  return Math.ceil(itemsCount / itemsPerPage);
});

const pageButtons = computed(() => {
  const rangeSize = 5;
  const rangeSizeScan = rangeSize + 1;
  const range = [...Array(rangeSizeScan * 2).keys()]
    .map((x) => x - rangeSizeScan + page)
    .filter((x) => x >= 1 && x <= pages.value);

  const i = range.findIndex((x) => x === page);
  const left = [];
  const right = [];
  const middle = page !== 1 && page !== pages.value ? [page] : [];

  let j = 1;
  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
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
    if (r && r !== pages.value) {
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

// Watches
watch(pageButtons, () => {
  /*
   * When page buttons change and the currently active page has to changes
   * because of the change in boundaries, we want to emit an event for that.
   */
  const pageClamped = clamp(page, 1, pages.value);
  if (page !== pageClamped) {
    emit("page", pageClamped);
  }
});

// Methods
const clamp = (x: number, min: number, max: number): number => {
  // When there's no pages then max = 0 and clamping breaks when min = 1.
  if (max < min) {
    max = min;
  }

  return Math.min(Math.max(x, min), max);
};

const prev = () => {
  emit("page", clamp(page - 1, 1, pages.value));
};

const next = () => {
  emit("page", clamp(page + 1, 1, pages.value));
};

const onPage = (p: number) => {
  emit("page", clamp(p, 1, pages.value));
};
</script>

<template>
  <ul v-if="pages > 1">
    <li :class="{ active: page === 1 }">
      <Button @click="onPage(1)">1</Button>
    </li>

    <li v-if="pages > 2">
      <Button @click="prev">
        <LucideChevronLeft />
      </Button>
    </li>

    <li
      v-for="p in pageButtons"
      :key="p"
      :class="{ active: p === page }"
    >
      <Button @click="onPage(p)">{{ p }}</Button>
    </li>

    <li v-if="pages > 2">
      <Button @click="next">
        <LucideChevronRight />
      </Button>
    </li>

    <li
      v-if="pages > 1"
      :class="{ active: page === pages }"
    >
      <Button @click="onPage(pages)">{{ pages }}</Button>
    </li>
  </ul>
</template>

<style scoped>
ul {
  display: flex;
  gap: 0.25rem;
  padding: 0;
  margin: 0;
  list-style-type: none;

  > li {
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;

    &.active {
      > button {
        --c-variant: var(--c-primary);
      }
    }

    > button {
      height: 2.5rem;
      width: 2.5rem;
      justify-content: center;
      padding: 0;

      --c-states: var(--c-primary);

      .lucide {
        width: 1.125rem;
        height: 1.125rem;
      }
    }
  }

  > li:nth-child(2),
  > li:nth-last-child(2) {
    --c-variant: var(--c-lvl3);
  }
}
</style>
