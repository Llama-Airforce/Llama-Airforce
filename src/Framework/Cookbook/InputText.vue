<template>
  <div class="input-text">
    <div class="dashboard">
      <Recipe title="InputText with placeholder">
        <template #example>
          <InputText
            v-model="text1"
            placeholder="Placeholder goes here"
          ></InputText>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="inputText"
          ></Code>
        </template>
      </Recipe>

      <Recipe title="InputText with search, options, filter, sorting and slot">
        <template #example>
          <InputText
            v-model="pool"
            placeholder="Search for a pool: enter a space here"
            :search="true"
            :auto-complete="autoComplete"
            :options="pools"
            :filter="filter"
            :sort="sort"
            @input="onInput"
            @select="onSelect"
          >
            <template #item="props: { item: Pool, idx: number }">
              <div
                v-if="props.item"
                class="search-item"
              >
                <img src="/why.png" />
                <div class="label">{{ props.item.name }}</div>
                <div
                  v-if="props.idx === 0"
                  class="description"
                >
                  Volume
                </div>
                <div class="volume">
                  <AsyncValue
                    :value="props.item.volume"
                    :precision="2"
                    type="dollar"
                  />
                </div>
              </div>
            </template>
          </InputText>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="inputTextSearch1"
          ></Code>

          <Code
            lang="typescript"
            :code="inputTextSearch2"
          ></Code>

          <Code
            lang="scss"
            :code="inputTextSearch3"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { InputText, AsyncValue, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const text1 = ref("");
const pool = ref("");
const autoComplete = ref(false);

type Pool = {
  name: string;
  volume: number;
};

const pools: Pool[] = [
  {
    name: "Pool A",
    volume: 10,
  },
  {
    name: "Pool B",
    volume: 1337,
  },
  {
    name: "Pool C",
    volume: 42,
  },
];

// Methods
const filter = (input: string, option: unknown) =>
  (option as Pool).name.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const sort = (a: unknown, b: unknown) =>
  (b as Pool).volume - (a as Pool).volume;

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const toggleExpansion = (newPool: Pool): void => {
  pool.value = newPool.name;
  autoComplete.value = false;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};

const inputText = `<InputText
  v-model="text1"
  placeholder="Placeholder goes here"
></InputText>`;

const inputTextSearch1 = `<InputText
  v-model="pool"
  placeholder="Search for a pool: enter a space here"
  :search="true"
  :auto-complete="autoComplete"
  :options="pools"
  :filter="filter"
  :sort="sort"
  @input="onInput"
  @select="onSelect"
>
  <template #item="props: { item: Pool, idx: number }">
    <div
      v-if="props.item"
      class="search-item"
    >
      <img src="/why.png" />
      <div class="label">{{ props.item.name }}</div>
      <div
        v-if="props.idx === 0"
        class="description"
      >
        Volume
      </div>
      <div class="volume">
        <AsyncValue
          :value="props.item.volume"
          :precision="2"
          type="dollar"
        />
      </div>
    </div>
  </template>
</InputText>`;

const inputTextSearch2 = `import { ref } from "vue";
import { InputText, AsyncValue } from "@/Framework";

const pool = ref("");
const autoComplete = ref(false);

type Pool = {
  name: string;
  volume: number;
};

const pools: Pool[] = [
  {
    name: "Pool A",
    volume: 10,
  },
  {
    name: "Pool B",
    volume: 1337,
  },
  {
    name: "Pool C",
    volume: 42,
  },
];

// Methods
const filter = (input: string, option: unknown) =>
  (option as Pool).name.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const sort = (a: unknown, b: unknown) =>
  (b as Pool).volume - (a as Pool).volume;

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const toggleExpansion = (newPool: Pool): void => {
  pool.value = newPool.name;
  autoComplete.value = false;
};

const onSelect = (option: unknown): void => {
  const pool = option as Pool;
  toggleExpansion(pool);
};`;

const inputTextSearch3 = `.search-item {
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
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("input-text");

.input-text {
  .dashboard {
    .search-item {
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
}
</style>
