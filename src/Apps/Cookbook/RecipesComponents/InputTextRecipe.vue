<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

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
const filter = (input: string, pool: Pool) =>
  pool.name.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const sort = (a: Pool, b: Pool) => b.volume - a.volume;

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const toggleExpansion = (newPool: Pool): void => {
  pool.value = newPool.name;
  autoComplete.value = false;
};

const onSelect = (pool: Pool): void => {
  toggleExpansion(pool);
};

const inputText = `<InputText
  v-model="text1"
  placeholder="Placeholder goes here"
></InputText>`;

const inputTextSearch1 = `<InputText
  v-model="pool"
  placeholder="Search for a pool: enter a space here"
  search
  :auto-complete
  :options="pools"
  :filter
  :sort
  @input="onInput"
  @select="onSelect"
>
  <template #item="{ item, idx }">
    <div class="search-item">
      <img src="@/Asset/Icons/why.png" />
      <div class="label">{{ item.name }}</div>
      <div
        v-if="idx === 0"
        class="description"
      >
        Volume
      </div>
      <div class="volume">
        <AsyncValue
          :value="item.volume"
          :precision="2"
          type="dollar"
        />
      </div>
    </div>
  </template>
</InputText>`;

const inputTextSearch2 = `const pool = ref("");
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
const filter = (input: string, pool: Pool) =>
  pool.name.toLocaleLowerCase().includes(input.toLocaleLowerCase());

const sort = (a: Pool, b: Pool) =>
  b.volume - a.volume;

// Events
const onInput = (input: string): void => {
  autoComplete.value = !!input;
};

const toggleExpansion = (newPool: Pool): void => {
  pool.value = newPool.name;
  autoComplete.value = false;
};

const onSelect = (pool: Pool): void => {
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

<template>
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
          lang="html"
          :code="inputText"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="InputText with search, options, filter, sorting and slot">
      <template #example>
        <InputText
          v-model="pool"
          search
          placeholder="Search for a pool: enter a space here"
          :auto-complete
          :options="pools"
          :filter
          :sort
          @input="onInput"
          @select="onSelect"
        >
          <template #item="{ item, idx }">
            <div class="search-item">
              <img src="@/Assets/Icons/why.png" />
              <div class="label">{{ item.name }}</div>
              <div
                v-if="idx === 0"
                class="description"
              >
                Volume
              </div>

              <div class="volume">
                <AsyncValue
                  type="dollar"
                  :value="item.volume"
                  :precision="2"
                />
              </div>
            </div>
          </template>
        </InputText>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="inputTextSearch1"
        ></Code>

        <Code
          lang="typescript"
          :code="inputTextSearch2"
        ></Code>

        <Code
          lang="css"
          :code="inputTextSearch3"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
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
</style>
