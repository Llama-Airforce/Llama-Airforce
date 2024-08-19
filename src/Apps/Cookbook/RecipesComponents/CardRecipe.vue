<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const collapsed = ref(false);

const card = `<ButtonToggle
  v-model="toggle"
  value="Value"
  icon="fas fa-plane"
></ButtonToggle>`;

const cardCompact = `<Card
  title="Card Title"
  icon="fas fa-plane"
>
  Content goes here
</Card>`;

const cardLoading = `<Card
  title="Card Loading"
  icon="fas fa-plane"
  :loading="true"
>
  Content goes here
</Card>`;

const cardCollapsible1 = `<Card
  title="Card Title"
  icon="fas fa-plane"
  :collapsible="true"
  :collapsed="collapsed"
  @click="collapsed = !collapsed"
>
  <template #actions>
    <i
      class="expander fas fa-chevron-up"
      :class="{ expanded: collapsed }"
    ></i>
  </template>

  <Collapsible :expanded="!collapsed"> Content goes here </Collapsible>
</Card>`;

const cardCollapsible2 = `const collapsed = ref(false);
`;

const cardCollapsible3 = `:deep(.card-header) {
  .expander {
    transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(180deg);
    }
  }
}`;
</script>

<template>
  <div class="cards">
    <Recipe title="Card">
      <template #example>
        <Card
          title="Card Title"
          icon="fas fa-plane"
        >
          Content goes here
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="card"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Compact / no padding">
      <template #example>
        <Card :compact="true"> Content goes here </Card>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="cardCompact"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Collapsible">
      <template #example>
        <Card
          title="Card Title"
          icon="fas fa-plane"
          :collapsible="true"
          :collapsed="collapsed"
          @click="collapsed = !collapsed"
        >
          <template #actions>
            <i
              class="expander fas fa-chevron-up"
              :class="{ expanded: collapsed }"
            ></i>
          </template>

          <Collapsible :expanded="!collapsed"> Content goes here </Collapsible>
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="cardCollapsible1"
        ></Code>

        <Code
          lang="typescript"
          :code="cardCollapsible2"
        ></Code>

        <Code
          lang="scss"
          :code="cardCollapsible3"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Loading">
      <template #example>
        <Card
          title="Card Loading"
          icon="fas fa-plane"
          :loading="true"
        >
          Content goes here
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="html"
          :code="cardLoading"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("cards");

.cards {
  column-gap: var(--dashboard-gap, 1.5rem);
  grid-template-columns: 1fr 1fr;

  :deep(.card-header) {
    .expander {
      transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
      transform: rotate(90deg);

      &.expanded {
        transform: rotate(180deg);
      }
    }
  }
}
</style>
