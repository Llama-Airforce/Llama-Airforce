<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const defaultTooltip = `<Tooltip>
  <template #trigger>
    <div>Hover over me!</div>
  </template>

  <div>Default tooltip content</div>
</Tooltip>`;

const customIconTooltip = `<Tooltip>
  <template #trigger>
    <LucideInfo />
  </template>

  <div>Tooltip with custom icon</div>
</Tooltip>`;

const eventTooltip = `<Tooltip @show="onTooltipShow">
  <template #trigger>
    <div>Hover to trigger event</div>
  </template>

  <div>This tooltip emits show events</div>
</Tooltip>`;

const eventHandler = `const onTooltipShow = (isShown: boolean) => {
  console.log('Tooltip visibility changed:', isShown);
};`;

const onTooltipShow = (isShown: boolean) => {
  window.console.log("Tooltip visibility changed:", isShown);
};
</script>

<template>
  <div class="dashboard">
    <Recipe title="Default Tooltip">
      <template #example>
        <Tooltip>
          <template #trigger>
            <div>Hover over me!</div>
          </template>

          <div>Default tooltip content</div>
        </Tooltip>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="defaultTooltip"
        />
      </template>
    </Recipe>

    <Recipe title="Custom Icon Tooltip">
      <template #example>
        <Tooltip>
          <template #trigger>
            <LucideInfo />
          </template>

          <div>Tooltip with custom icon</div>
        </Tooltip>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="customIconTooltip"
        />
      </template>
    </Recipe>

    <Recipe title="Event Handling Tooltip">
      <template #example>
        <Tooltip @show="onTooltipShow">
          <template #trigger>
            <div>Hover to trigger event</div>
          </template>

          <div>This tooltip emits show events</div>
        </Tooltip>

        <p>Check console for event logs</p>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="eventTooltip"
        />

        <Code
          lang="typescript"
          :code="eventHandler"
        />
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  grid-template-columns: 1fr 1fr;
}
</style>
