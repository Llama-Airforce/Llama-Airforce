<script setup lang="ts">
import Strategy from "./Strategy.vue";
import Fees from "./Fees.vue";
import Audits from "./Audits.vue";

const tabs = ["strategy", "fees", "audits"] as const;
type Tabs = (typeof tabs)[number];
const tab = ref(tabs[0] as Tabs);

const onTab = (newTab: Tabs) => {
  tab.value = newTab;
};
</script>

<template>
  <Card title="Vault Info">
    <template #actions>
      <div class="tabs">
        <ButtonToggle
          :model-value="tab === 'strategy'"
          @click="onTab('strategy')"
        >
          Strategy
        </ButtonToggle>

        <ButtonToggle
          :model-value="tab === 'fees'"
          @click="onTab('fees')"
        >
          Fees
        </ButtonToggle>

        <ButtonToggle
          :model-value="tab === 'audits'"
          @click="onTab('audits')"
        >
          Audits
        </ButtonToggle>
      </div>
    </template>

    <div class="vault-info-body">
      <Strategy v-if="tab === 'strategy'" />
      <Fees v-if="tab === 'fees'" />
      <Audits v-if="tab === 'audits'" />
    </div>
  </Card>
</template>

<style scoped>
.tabs {
  display: flex;
  gap: var(--dashboard-gap);

  button {
    font-size: 14px;
  }
}

.vault-info-body {
  display: flex;
  align-items: center;
  height: 8rem;
}
</style>
