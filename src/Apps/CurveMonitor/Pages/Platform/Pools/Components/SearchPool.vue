<template>
  <InputText
    class="select-pool"
    :model-value="modelValue"
    :placeholder="placeholder"
    :search="true"
    :auto-complete="autoComplete"
    :options="pools"
    :filter="filter"
    :sort="sort"
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
        <div
          v-if="props.idx === 0"
          class="description"
        >
          {{ t("search-description") }}
        </div>
        <div class="volume">
          <AsyncValue
            :value="volume(props.item)"
            :precision="2"
            type="dollar"
          />
        </div>
      </div>
    </template>
  </InputText>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { useI18n } from "vue-i18n";
import { InputText, AsyncValue } from "@/Framework";
import { shorten, icon } from "@/Util";
import { useCurvePoolsStore } from "@CM/Pages/Platform/Pools/Store";
import { match } from "@CM/Pages/Platform/Pools/Util/PoolHelper";
import type { Pool } from "@CM/Pages/Platform/Pools/Models";

const { t } = useI18n();

// Props
interface Props {
  modelValue: string;
}

const { modelValue } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "update:modelValue", pool: string): void;
  (e: "select", pool: Pool): void;
}>();

// Refs
const store = useCurvePoolsStore();

const autoComplete = ref(false);
const placeholder = ref(t("search-placeholder"));

const pools = computed((): Pool[] => {
  return store.pools;
});

// Methods.
const filter = (input: string, option: unknown) => match(input, option as Pool);
const sort = (a: unknown, b: unknown) => volume(b as Pool) - volume(a as Pool);

const volume = (pool: Pool): number => {
  return pool.cumulateVolumeUsd;
};

const name = (pool: Pool): string => {
  const nameShort = shorten(pool.name);
  const nameTrimmed =
    nameShort.substring(0, 9) === "Curve.fi " ? nameShort.slice(9) : nameShort;

  return nameTrimmed;
};

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  autoComplete.value = false;

  emit("select", pool);
};

// Watches
watch(
  [() => store.poolsLoading, () => store.poolsLoadingError],
  ([newLoading, newError]) => {
    if (newError) {
      placeholder.value = t("search-error");
    } else if (newLoading) {
      placeholder.value = t("search-loading");
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

    > .volume,
    > .description {
      font-size: 0.875rem;
      margin-left: 0.75rem;
    }

    > .description {
      color: var(--c-lvl5);
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
search-loading: Loading pools, please wait...
search-placeholder: Search for Curve pools
search-error: Failed loading Curve pools
search-description: Cumulative Volume
</i18n>
