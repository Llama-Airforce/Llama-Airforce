<template>
  <div
    class="controls"
    :class="{ hasPool: !!poolSelected }"
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
    <Status :status-service="statusService"></Status>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { shorten } from "@/Util";
import type { Pool } from "@/Pages/CurveMonitor/Models";
import { PoolService, StatusService } from "@/Pages/CurveMonitor/Services";
import SelectorPair from "@/Pages/CurveMonitor/Components/SelectorPair.vue";
import SelectorRange from "@/Pages/CurveMonitor/Components/SelectorRange.vue";
import Status from "@/Pages/CurveMonitor/Components/Status.vue";
import SearchPool from "@/Pages/CurveMonitor/Components/SearchPool.vue";

let pool = $ref("");
let poolSelected: Pool | null = $ref(null);

// Props
interface Props {
  statusService: StatusService;
  poolService: PoolService;
}

const { statusService, poolService } = defineProps<Props>();

// Emits
const emit = defineEmits<{
  (e: "select", pool: Pool): void;
}>();

// Events
const onSelect = (option: unknown): void => {
  const poolNew = option as Pool;

  pool = shorten(poolNew.name);
  poolSelected = poolNew;

  emit("select", poolNew);
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
    .ranges {
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

  .status {
    grid-column: 5;

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
