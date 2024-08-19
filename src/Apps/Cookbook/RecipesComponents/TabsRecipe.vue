<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const onTabChange = (event: { index: number }) => {
  tabActive.value = event.index;
  console.log("Tab changed:", event);
};

const tabActive = ref(0);

const tabs1 = `<TabView @tab="tabActive = $event.index">
  <TabItem header="Tab One"> Tab 1 content goes here </TabItem>
  <TabItem header="Tab Two"> Tab 2 content goes here </TabItem>
  <TabItem header="Tab Three"> Tab 3 content goes here </TabItem>
</TabView>`;

const tabs2 = `const tabActive = ref(0);

const onTabChange = (event: { tab: any; index: number }) => {
  tabActive.value = event.index;
  console.log('Tab changed:', event);
};`;
</script>

<template>
  <div class="tabs">
    <Recipe title="Tabs">
      <template #example>
        <div class="active">Active tab is index {{ tabActive }}</div>

        <TabView
          :active="tabActive"
          @tab="onTabChange"
        >
          <TabItem header="Tab One"> Tab 1 content goes here </TabItem>
          <TabItem header="Tab Two"> Tab 2 content goes here </TabItem>
          <TabItem header="Tab Three"> Tab 3 content goes here </TabItem>
        </TabView>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="tabs1"
        ></Code>

        <Code
          lang="typescript"
          :code="tabs2"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("tabs");
</style>
