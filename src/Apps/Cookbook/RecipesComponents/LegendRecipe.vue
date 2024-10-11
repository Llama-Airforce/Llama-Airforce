<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const theme = useTheme();

const { items, toggles, disabled } = useLegend(() => {
  const { blue, yellow, purple } = theme.value.colors;

  return [
    { id: "crv", label: "CRV", color: blue, togglable: true },
    { id: "circ", label: "Circulating", color: yellow, togglable: true },
    { id: "vecrv", label: "veCRV", color: purple, togglable: true },
  ];
});
</script>

<template>
  <div class="dashboard">
    <Recipe title="Legend">
      <template #example>
        <Legend
          :items
          :disabled
          @toggle="toggles[$event].value = !toggles[$event].value"
        ></Legend>

        <div class="legend-values">
          <Code
            lang="typescript"
            :code="JSON.stringify(items, null, 2)"
          />

          <Code
            lang="typescript"
            :code="JSON.stringify(toggles, null, 2)"
          />

          <Code
            lang="typescript"
            :code="JSON.stringify(disabled, null, 2)"
          />
        </div>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.legend-values {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}
</style>
