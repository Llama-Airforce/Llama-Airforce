<template>
  <div class="tooltips">
    <Recipe title="Default Tooltip">
      <template #example>
        <Tooltip>
          <template #item>
            <div>Hover over me!</div>
          </template>

          <div>Default tooltip content</div>
        </Tooltip>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="defaultTooltip"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Custom Icon Tooltip">
      <template #example>
        <Tooltip icon="fas fa-info-circle">
          <div>Tooltip with custom icon</div>
        </Tooltip>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="customIconTooltip"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Event Handling Tooltip">
      <template #example>
        <Tooltip @show="onTooltipShow">
          <template #item>
            <div>Hover to trigger event</div>
          </template>

          <div>This tooltip emits show events</div>
        </Tooltip>

        <p>Check console for event logs</p>
      </template>

      <template #snippets>
        <Code
          lang="xml"
          :code="eventTooltip"
        ></Code>

        <Code
          lang="typescript"
          :code="eventHandler"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const defaultTooltip = `<Tooltip>
  <template #item>
    <div>Hover over me!</div>
  </template>

  <div>Default tooltip content</div>
</Tooltip>`;

const customIconTooltip = `<Tooltip icon="fas fa-info-circle">
  <div>Tooltip with custom icon</div>
</Tooltip>`;

const eventTooltip = `<Tooltip @show="onTooltipShow">
  <template #item>
    <div>Hover to trigger event</div>
  </template>

  <div>This tooltip emits show events</div>
</Tooltip>`;

const eventHandler = `const onTooltipShow = (isShown: boolean) => {
  console.log('Tooltip visibility changed:', isShown);
};`;

const onTooltipShow = (isShown: boolean) => {
  console.log("Tooltip visibility changed:", isShown);
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("tooltips");

.tooltips {
  grid-template-columns: 1fr 1fr;
}
</style>
