<template>
  <div class="contracts">
    <Card :title="t('repositories')">
      <DataTable
        class="datatable-repositories"
        :rows="repositories"
        :columns="[t('repository'), t('description')]"
      >
        <template #row="props: { item: Repository }">
          <div>
            <a
              :href="props.item.url"
              target="_blank"
            >
              {{ props.item.name }}
            </a>
          </div>

          <div>{{ t(props.item.description) }}</div>
        </template>
      </DataTable>
    </Card>
  </div>
</template>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("contracts");

.contracts {
  max-width: calc(1920px - 18.125rem);

  display: flex;
  flex-direction: column;
  gap: var(--dashboard-gap);

  .datatable-repositories {
    --columns-data: 2fr 6fr;
  }
}
</style>

<i18n lang="yaml" locale="en">
repositories: Repositories
repository: Repository
description: Description

repo-laf: This website's front-end, excluding the Union
</i18n>
