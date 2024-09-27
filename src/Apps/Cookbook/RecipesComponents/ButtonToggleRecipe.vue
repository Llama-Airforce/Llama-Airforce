<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const darkMode = ref(false);
const notifications = ref(true);

const toggleDarkMode = (value: boolean) => {
  console.log(`Switching to ${value ? "dark" : "light"} mode`);
};

const darkModeExample = `<ButtonToggle v-model="darkMode" @change="toggleDarkMode">
  <LucideMoon v-if="darkMode" />
  <LucideSun v-else />
  {{ darkMode ? 'Dark Mode' : 'Light Mode' }}
</ButtonToggle>`;

const notificationsExample = `<ButtonToggle v-model="notifications">
  <LucideBell />
  Notifications
</ButtonToggle>`;
</script>

<template>
  <div class="dashboard">
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
          <LucideMoon v-if="darkMode" />
          <LucideSun v-else />
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
        <ButtonToggle v-model="notifications">
          <LucideBell />
          Notifications
        </ButtonToggle>
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

<style scoped>
.dashboard {
  p {
    margin-top: 0.5rem;
    margin-bottom: 1rem;
  }
}
</style>
