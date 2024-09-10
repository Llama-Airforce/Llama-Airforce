<script setup lang="ts">
const { t } = useI18n();

type Repository = {
  name: string;
  url: string;
  description: string;
};

const repositories: Repository[] = [
  {
    name: "Llama Airforce",
    url: "https://github.com/Llama-Airforce/Llama-Airforce",
    description: "repo-laf",
  },
];
</script>

<template>
  <div class="dashboard">
    <Card :title="t('repositories')">
      <Table
        class="repositories-table"
        :rows="repositories"
        :columns="[t('repository'), t('description')]"
      >
        <template #row="{ item }">
          <div>
            <a
              :href="item.url"
              target="_blank"
            >
              {{ item.name }}
            </a>
          </div>

          <div>{{ t(item.description) }}</div>
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

<i18n lang="yaml" locale="en">
repositories: Repositories
repository: Repository
description: Description

repo-laf: This website's front-end, excluding the Union
</i18n>
