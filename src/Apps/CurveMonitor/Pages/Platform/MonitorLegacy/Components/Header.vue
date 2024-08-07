<template>
  <div class="header">
    <Card>
      <div class="header-content">
        <div class="title">Live monitor</div>
        <div class="controls">
          <SearchPool
            v-model="pool"
            class="search"
            :pool-service="poolService"
            @select="onSelect"
          ></SearchPool>

          <Status></Status>
        </div>
      </div>
    </Card>
  </div>
</template>

<script setup lang="ts">
import { useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import type { Pool } from "@CM/Models";
import { type PoolService } from "@CM/Services/MonitorLegacy";
import SearchPool from "@CM/Pages/Platform/MonitorLegacy/Components/SearchPool.vue";
import Status from "@CM/Pages/Platform/MonitorLegacy/Components/Status.vue";

// Props
interface Props {
  poolService: PoolService;
}

const { poolService } = defineProps<Props>();

// Refs
const store = useMonitorStore();

const pool = ref("");

// Events
const onSelect = (poolNew: Pool): void => {
  pool.value = shorten(poolNew.name);
  store.pool = poolNew;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.header {
  :deep(.card) {
    .card-container {
      background: var(--header-background);

      input {
        background: var(--c-lvl2);

        &:hover {
          background: var(--c-lvl2-hover);
        }

        &:active {
          background: var(--c-lvl2-active);
        }
      }
    }
  }

  .status {
    display: flex;
    align-items: center;
    justify-content: center;

    background: var(--c-lvl2);
    border-radius: var(--border-radius);
    height: 2.5rem;
    width: 2.5rem;
  }
}

.header-content {
  flex-grow: 1;

  display: grid;
  grid-template-columns: 0.4fr 0.6fr auto;
  align-items: center;
  gap: 1rem;

  margin: 1.625rem 1.375rem;

  @media only screen and (max-width: 1280px) {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    margin: 0;

    .title {
      font-size: 2rem !important;
    }
  }

  .controls {
    display: flex;
    flex-grow: 1;
    gap: 1rem;
  }

  .title {
    font-size: 2.5rem;
    font-family: var(--header-font-family, inherit);
    font-weight: 700;
    color: var(--header-font-color, inherit);
  }
}
</style>
