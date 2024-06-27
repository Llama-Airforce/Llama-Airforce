<template>
  <Card title="User Info">
    <template #actions>
      <div class="tabs">
        <ButtonToggle
          value="Rewards"
          :model-value="tab === 'rewards'"
          @click="onTab('rewards')"
        >
        </ButtonToggle>

        <ButtonToggle
          value="Redemptions"
          :model-value="tab === 'redemptions'"
          @click="onTab('redemptions')"
        >
        </ButtonToggle>
      </div>
    </template>

    <Rewards v-if="tab === 'rewards'"></Rewards>
    <RedemptionsUser v-if="tab === 'redemptions'"></RedemptionsUser>
  </Card>
</template>

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

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.tabs {
  display: flex;
  gap: var(--dashboard-gap);

  button {
    font-size: 14px;
  }
}
</style>
