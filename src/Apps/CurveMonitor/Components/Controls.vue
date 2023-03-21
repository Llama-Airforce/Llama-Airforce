<template>
  <div
    class="controls"
    :class="{ hasPool }"
  >
    <div class="logo">
      <img src="@/Assets/crv.png" />
      <span>Curve</span>
    </div>

    <SearchPool
      v-model="pool"
      class="search"
      :pool-service="poolService"
      @select="onSelect"
    ></SearchPool>

    <SelectorPair></SelectorPair>
    <SelectorRange></SelectorRange>

    <Theme></Theme>
    <Status :status-service="statusService"></Status>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { shorten } from "@/Util";
import { useCurveMonitorStore } from "@CM/Store";
import type { Pool } from "@CM/Models";
import { PoolService, StatusService } from "@CM/Services";
import SelectorPair from "@CM/Components/SelectorPair.vue";
import SelectorRange from "@CM/Components/SelectorRange.vue";
import Theme from "@CM/Components/Theme.vue";
import Status from "@CM/Components/Status.vue";
import SearchPool from "@CM/Components/SearchPool.vue";

// Props
interface Props {
  statusService: StatusService;
  poolService: PoolService;
}

const { statusService, poolService } = defineProps<Props>();

// Refs
const store = useCurveMonitorStore();

const pool = ref("");

const hasPool = computed(() => store.pool !== null);

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool.value = shorten(poolNew.name);
  store.pool = poolNew;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@keyframes pulse {
  0% {
    transform: scale(0.94);
  }

  70% {
    transform: scale(1);
  }

  100% {
    transform: scale(0.94);
  }
}

.controls {
  &:not(.hasPool) {
    display: flex;
    flex-direction: column;
    justify-self: center;
    gap: 8rem;
    width: 600px;

    position: absolute;
    top: 22%;
    left: 50%;

    @media only screen and (max-width: 1280px) {
      width: calc(80% - 2rem);
      padding: 0 1rem;
      gap: 10rem;
      align-self: center;
    }

    .logo,
    .search {
      transform: translateY(-50%) translateX(-50%);
    }

    .logo {
      display: grid;
      grid-template-columns: 1fr 1fr;
      align-items: center;
      align-self: auto;

      img {
        height: 128px;
        object-fit: contain;
        justify-self: end;
        margin-right: 3rem;
      }

      span {
        display: flex;
        font-size: 3rem;
        align-items: center;
      }
    }

    .status {
      position: fixed;
      top: 0.5rem;
      right: 1rem;

      @media only screen and (max-width: 1280px) {
        position: absolute;
        right: 50%;
      }
    }

    .pair,
    .ranges,
    .theme {
      display: none;
    }
  }

  background: $background-color;
  position: sticky;
  top: 0;
  padding: 1rem 0;
  z-index: 1;

  display: grid;
  grid-template-rows: auto;
  grid-template-columns: auto 1fr auto auto auto;
  gap: 2rem;

  @media only screen and (max-width: 1280px) {
    padding: 1.5rem 1rem;
  }

  .logo {
    grid-column: 1;

    display: flex;
    align-items: center;
    align-self: center;
    gap: 1rem;
    height: 30px;

    img {
      height: 30px;
      object-fit: contain;

      transform: scale(1);
      animation: pulse 2s infinite;
    }

    span {
      display: none;
    }
  }

  .search {
    grid-column: 2;

    &.hasPool {
      margin-top: 0;
    }
  }

  .theme {
    grid-column: 5;

    display: flex;
    align-items: center;

    margin-left: -1rem;
    margin-right: -1rem;
  }

  .status {
    grid-column: 6;

    display: flex;
    align-items: center;
    justify-self: end;
  }

  .pair {
    grid-column: 3;
    align-self: center;
  }

  .ranges {
    grid-column: 4;
    align-self: center;
  }
}
</style>
