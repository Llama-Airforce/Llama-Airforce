<template>
  <li>
    <router-link
      :to="to"
      class="nav-link"
      :class="{ 'router-link-active': subIsActive(to, route) }"
    >
      <div class="nav-link-container">
        <i
          v-if="icon"
          :class="icon"
        ></i>
        {{ label }}
      </div>
    </router-link>
  </li>
</template>

<script setup lang="ts">
import { useRoute } from "vue-router";
import { subIsActive } from "@/Util/RouterHelper";
// Props
interface Props {
  icon?: string;
  label: string;
  to: string;
}

const { icon = "", label, to } = defineProps<Props>();

// Refs
const route = useRoute();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

i {
  display: flex;
  justify-content: center;
  min-width: 1.125rem;
  margin-right: 1rem;
}

.nav-link {
  font-weight: 500;
  -webkit-tap-highlight-color: transparent; // Disable blue highlight because of pointer.
}
</style>
