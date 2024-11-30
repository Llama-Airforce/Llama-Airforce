<script setup lang="ts">
type Repository = {
  name: string;
  url: string;
  description: string;
};

type API = {
  name: string;
  url: string;
  description: string;
};

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "This website's front-end, excluding the Union",
  },
];

const apis: API[] = [
  {
    name: "Hippo Army API",
    url: "https://api.hippo.army",
    description: "Back-end API for Hippo Army",
  },
  {
    name: "Hippo Army Python API",
    url: "https://api-py.hippo.army/feeds-docs",
    description: "Back-end API (Python) for Hippo Army",
  },
];
</script>

<template>
  <div class="dashboard">
    <Card title="Repositories">
      <Table
        class="repositories-table"
        title="Yolo"
        :rows="repositories"
        :columns="['Repository', 'Description']"
      >
        <template #row="{ item }">
          <div>
            <a
              target="_blank"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </div>

          <div>{{ item.description }}</div>
        </template>
      </Table>
    </Card>

    <Card title="APIs">
      <Table
        class="apis-table"
        columns-data="apis-columns-data"
        :rows="apis"
        :columns="['API', 'Description']"
      >
        <template #row="{ item }">
          <div>
            <a
              target="_blank"
              :href="item.url"
            >
              {{ item.name }}
            </a>
          </div>

          <div>{{ item.description }}</div>
        </template>
      </Table>
    </Card>

    <Card>
      <div class="notices">
        TradingView Lightweight Charts™ Copyright (с) 2023 TradingView, Inc.
        <span>
          <a
            href="https://www.tradingview.com/"
            target="_blank"
          >
            https://www.tradingview.com
          </a>
        </span>
      </div>
    </Card>
  </div>
</template>

<style scoped>
.dashboard {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  .apis-table {
    --columns-data: 3fr 4fr;
  }

  .repositories-table {
    --columns-data: 2fr 6fr;
  }

  .notices {
    display: flex;
    flex-direction: column;
    gap: 0.75ch;
  }
}
</style>
