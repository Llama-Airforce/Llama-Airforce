<template>
  <InputText
    class="select-pool"
    :model-value="modelValue"
    :placeholder="placeholder"
    :search="true"
    :auto-complete="autoComplete"
    :options="pools"
    @input="onInput"
    @select="onSelect"
  >
    <template #item="props: { item: Pool, idx: number }">
      <div
        v-if="props.item"
        class="item"
      >
        <div class="label">{{ name(props.item) }}</div>
      </div>
    </template>
  </InputText>
</template>

<script setup lang="ts">
import { debounce } from "lodash";
import { useMonitorStore } from "@CM/Pages/Pool/Monitor/Store";
import { getPools } from "@CM/Pages/Pool/Monitor/DataLoaders";
import { type Pool } from "@CM/Models";
import { type PoolService } from "@CM/Services";

const { t } = useI18n();

// Model
const modelValue = defineModel<string>({ required: true });

// Props
interface Props {
  poolService: PoolService;
}

const { poolService } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  select: [pool: Pool];
}>();

// Refs
const storeMonitor = useMonitorStore();

const autoComplete = ref(false);
const placeholder = ref(t("search-placeholder"));

const pools = computed((): Pool[] => {
  return storeMonitor.pools;
});

// Methods.
const name = (pool: Pool): string => {
  const nameShort = shorten(pool.name);
  const nameTrimmed = nameShort.startsWith("Curve.fi ")
    ? nameShort.slice(9)
    : nameShort;

  return nameTrimmed;
};

// Events
const getPoolsDebounced = debounce(getPools, 200, { maxWait: 1000 });

const onInput = (input: string): void => {
  void getPoolsDebounced(storeMonitor, poolService, input);
  autoComplete.value = !!input;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  autoComplete.value = false;

  emit("select", pool);
};

// Watches
watch(
  () => storeMonitor.poolsLoadingError,
  (newError) => {
    if (newError) {
      placeholder.value = t("search-error");
    } else {
      placeholder.value = t("search-placeholder");
    }
  }
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.select-pool {
  .item {
    display: flex;
    align-items: center;

    img {
      width: 20px;
      height: 20px;
      object-fit: scale-down;
    }

    > .label {
      flex-grow: 1;
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
search-loading: Loading pools, please wait...
search-placeholder: Search for Curve pools
search-error: Failed loading Curve pools
</i18n>
