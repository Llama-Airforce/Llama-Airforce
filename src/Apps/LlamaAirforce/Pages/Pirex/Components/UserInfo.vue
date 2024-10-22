<script setup lang="ts">
import Rewards from "@LAF/Pages/Pirex/Components/Rewards.vue";
import RedemptionsUser from "@LAF/Pages/Pirex/Components/RedemptionsUser.vue";

const tabs = ["rewards", "redemptions"] as const;
type Tabs = (typeof tabs)[number];
const tab = ref(tabs[0] as Tabs);

const onTab = (newTab: Tabs) => {
  tab.value = newTab;
};
</script>

<template>
  <Card title="User Info">
    <template #actions>
      <div class="tabs">
        <ButtonToggle
          :model-value="tab === 'rewards'"
          @click="onTab('rewards')"
        >
          Rewards
        </ButtonToggle>

        <ButtonToggle
          :model-value="tab === 'redemptions'"
          @click="onTab('redemptions')"
        >
          Redemptions
        </ButtonToggle>
      </div>
    </template>

    <Rewards v-if="tab === 'rewards'" />
    <RedemptionsUser v-if="tab === 'redemptions'" />
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
</style>
