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
import { type Socket } from "socket.io-client";
import { useMonitorStore } from "@CM/Pages/Pool/Monitor/Store";
import { StatusService } from "@CM/Services";

// Refs
const storeMonitor = useMonitorStore();

const ping = ref(Infinity);
const status = ref<"good" | "meh" | "bad">("bad");

// Hooks
watch(
  () => storeMonitor.socket as Socket,
  (socket: Socket) => {
    if (!socket) {
      return;
    }

    const statusService = new StatusService(socket);

    statusService.get$.subscribe((ms) => {
      ping.value = ms;
      status.value = ms <= 50 ? "good" : ms <= 500 ? "meh" : "bad";
    });
  },
  { immediate: true }
);
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
