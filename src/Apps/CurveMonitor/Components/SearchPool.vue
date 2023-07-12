<template>
  <InputText
    class="select-pool"
    :model-value="modelValue"
    :placeholder="placeholder"
    :search="true"
    :auto-complete="autoComplete"
    :options="pools"
    @update:model-value="emit('update:modelValue', $event)"
    @input="onInput"
    @select="onSelect"
  >
    <template #item="props: { item: Pool, idx: number }">
      <div
        v-if="props.item"
        class="item"
      >
        <img :src="icon(props.item.name, false)" />
        <div class="label">{{ name(props.item) }}</div>
      </div>
    </template>
  </InputText>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { debounce } from "lodash";
import { InputText } from "@/Framework";
import { shorten, icon } from "@/Util";
import { useMonitorStore } from "@CM/Pages/Pool/Store";
import { getPools } from "@CM/Pages/Pool/DataLoaders";
import { type Pool } from "@CM/Models";
import { type PoolService } from "@CM/Services";

const { t } = useI18n();

// Props
interface Props {
  modelValue: string;
  poolService: PoolService;
}

const { modelValue, poolService } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  "update:modelValue": [pool: string];
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
