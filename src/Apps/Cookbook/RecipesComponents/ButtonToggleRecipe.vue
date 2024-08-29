<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const darkMode = ref(false);
const notifications = ref(true);

const toggleDarkMode = (value: boolean) => {
  console.log(`Switching to ${value ? "dark" : "light"} mode`);
};

const darkModeExample = `<ButtonToggle v-model="darkMode" @change="toggleDarkMode">
  <i :class="darkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
  {{ darkMode ? 'Dark Mode' : 'Light Mode' }}
</ButtonToggle>`;

const notificationsExample = `<ButtonToggle v-model="notifications" value="Notifications" icon="fas fa-bell"></ButtonToggle>`;
</script>

<template>
  <div class="button-toggles">
    <Recipe title="Dark Mode Toggle">
      <template #description>
        Use ButtonToggle to switch between dark and light modes in your
        application.
      </template>

      <template #example>
        <ButtonToggle
          v-model="darkMode"
          @change="toggleDarkMode"
        >
          <i :class="darkMode ? 'fas fa-moon' : 'fas fa-sun'"></i>
          {{ darkMode ? "Dark Mode" : "Light Mode" }}
        </ButtonToggle>
        <p>Current theme: {{ darkMode ? "Dark" : "Light" }}</p>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="darkModeExample"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Notification Settings">
      <template #description>
        Implement a simple toggle for enabling or disabling notifications.
      </template>

      <template #example>
        <ButtonToggle
          v-model="notifications"
          value="Notifications"
          icon="fas fa-bell"
        ></ButtonToggle>
        <p>Notifications are {{ notifications ? "enabled" : "disabled" }}</p>
      </template>

      <template #snippets>
        <Code
          lang="typescript"
          :code="notificationsExample"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("button-toggles");

.button-toggles {
  p {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>
