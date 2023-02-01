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
import { watch } from "vue";
import { $computed, $ref } from "vue/macros";
import { useI18n } from "vue-i18n";
import { debounce } from "lodash";
import { InputText } from "@/Framework";
import { shorten, icon } from "@/Util";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import { PoolService } from "@/Pages/CurveMonitor/Services";
import { getPools } from "@/Pages/CurveMonitor/DataLoaders";

const { t } = useI18n();

// Props
interface Props {
  modelValue: string;
  poolService: PoolService;
}

const { modelValue, poolService } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", pool: string): void;
  (e: "select", pool: Pool): void;
}>();

// Refs
const store = useCurveMonitorStore();

let autoComplete = $ref(false);
let placeholder = $ref(t("search-placeholder"));

const pools = $computed((): Pool[] => {
  return store.pools;
});

// Methods.
const name = (pool: Pool): string => {
  const nameShort = shorten(pool.name);
  const nameTrimmed =
    nameShort.substring(0, 9) === "Curve.fi " ? nameShort.slice(9) : nameShort;

  return nameTrimmed;
};

// Events
const getPoolsDebounced = debounce(getPools, 200, { maxWait: 1000 });

const onInput = (input: string): void => {
  void getPoolsDebounced(store, poolService, input);
  autoComplete = !!input;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  autoComplete = false;

  emit("select", pool);
};

// Watches
watch(
  () => store.poolsLoadingError,
  (newError) => {
    if (newError) {
      placeholder = t("search-error");
    } else {
      placeholder = t("search-placeholder");
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
