<template>
  <Card title="Vault Info">
    <template #actions>
      <div class="tabs">
        <ButtonToggle
          value="Strategy"
          :model-value="tab === 'strategy'"
          @click="onTab('strategy')"
        >
        </ButtonToggle>

        <ButtonToggle
          value="Fees"
          :model-value="tab === 'fees'"
          @click="onTab('fees')"
        >
        </ButtonToggle>

        <ButtonToggle
          value="Audits"
          :model-value="tab === 'audits'"
          @click="onTab('audits')"
        >
        </ButtonToggle>
      </div>
    </template>

    <div class="vault-info-body">
      <Strategy v-if="tab === 'strategy'"></Strategy>
      <Fees v-if="tab === 'fees'"></Fees>
      <Audits v-if="tab === 'audits'"></Audits>
    </div>
  </Card>
</template>

<script setup lang="ts">
import Strategy from "@LAF/Pages/Pirex/Components/Strategy.vue";
import Fees from "@LAF/Pages/Pirex/Components/Fees.vue";
import Audits from "@LAF/Pages/Pirex/Components/Audits.vue";

const tabs = ["strategy", "fees", "audits"] as const;
type Tabs = (typeof tabs)[number];
const tab = ref(tabs[0] as Tabs);

const onTab = (newTab: Tabs) => {
  tab.value = newTab;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tabs {
  display: flex;
  gap: var(--dashboard-gap);

  button {
    font-size: 14px;
  }
}

.vault-info-body {
  display: flex;
  flex-grow: 1;
  align-items: center;
  height: 8rem;
}
</style>
