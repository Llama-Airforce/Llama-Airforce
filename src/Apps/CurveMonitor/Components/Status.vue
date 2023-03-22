<template>
  <div class="status">
    <Tooltip class="tooltip">
      <template #item>
        <div
          class="indicator"
          :class="status"
        ></div>
      </template>

      <div class="ping">Ping: {{ ping === Infinity ? "?" : ping }}ms</div>
    </Tooltip>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";
import { Tooltip } from "@/Framework";
import StatusService from "@CM/Services/StatusService";

// Props
interface Props {
  statusService: StatusService;
}

const { statusService } = defineProps<Props>();

// Refs
const ping = ref(Infinity);
const status = ref<"good" | "meh" | "bad">("bad");

// Hooks
onMounted(() => {
  statusService.get$.subscribe((ms) => {
    ping.value = ms;
    status.value = ms <= 50 ? "good" : ms <= 500 ? "meh" : "bad";
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.status {
  display: flex;

  .tooltip {
    div {
      display: flex;
    }
  }

  .ping {
    display: flex;
    align-items: center;

    font-size: 0.75rem;
  }

  .indicator {
    height: 1rem;
    width: 1rem;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;

    transition: background-color 0.5s ease;

    &.good {
      background-color: var(--c-green);
    }

    &.meh {
      background-color: var(--c-yellow);
    }

    &.bad {
      background-color: var(--c-red);
    }
  }
}
</style>
