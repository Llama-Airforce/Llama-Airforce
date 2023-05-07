<template>
  <div class="tabs">
    <div class="dashboard">
      <Recipe title="Tabs">
        <template #example>
          <div class="active">Active tab is index {{ tabActive }}</div>

          <TabView @tab="tabActive = $event.index">
            <TabItem header="Tab One"> Tab 1 content goes here </TabItem>
            <TabItem header="Tab Two"> Tab 2 content goes here </TabItem>
            <TabItem header="Tab Three"> Tab 3 content goes here </TabItem>
          </TabView>
        </template>

        <template #snippets>
          <Code
            lang="xml"
            :code="tabs1"
          ></Code>

          <Code
            lang="typescript"
            :code="tabs2"
          ></Code>
        </template>
      </Recipe>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import { TabView, TabItem, Code } from "@/Framework";
import Recipe from "@/Framework/Cookbook/Recipe.vue";

const tabActive = ref(0);

const tabs1 = `<TabView @tab="tabActive = $event.index">
  <TabItem header="Tab One"> Tab 1 content goes here </TabItem>
  <TabItem header="Tab Two"> Tab 2 content goes here </TabItem>
  <TabItem header="Tab Three"> Tab 3 content goes here </TabItem>
</TabView>`;

const tabs2 = `import { TabView, TabItem } from "@/Framework";

const tabActive = ref(0);
`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("tabs");
</style>
