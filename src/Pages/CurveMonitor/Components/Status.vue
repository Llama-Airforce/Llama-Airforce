<template>
  <div class="status">
    <div class="ping">{{ ping === Infinity ? "?" : ping }}</div>
    <div
      class="indicator"
      :class="status"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from "vue";
import StatusService from "@/Pages/CurveMonitor/Services/StatusService";
import { $ref } from "vue/macros";

// Props
interface Props {
  statusService: StatusService;
}

const { statusService } = defineProps<Props>();

// Refs
let ping = $ref(Infinity);
let status: "good" | "meh" | "bad" = $ref("bad");

// Hooks
onMounted(() => {
  statusService.get$.subscribe((ms) => {
    ping = ms;
    status = ms <= 50 ? "good" : ms <= 500 ? "meh" : "bad";
  });
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.status {
  display: flex;

  > .ping {
    display: flex;
    align-items: center;

    font-size: 0.75rem;
    margin-right: 0.5rem;
  }

  > .indicator {
    height: 1rem;
    width: 1rem;
    background-color: #bbb;
    border-radius: 50%;
    display: inline-block;

    transition: background-color 0.5s ease;

    &.good {
      background-color: $green;
    }

    &.meh {
      background-color: $yellow;
    }

    &.bad {
      background-color: $red;
    }
  }
}
</style>
