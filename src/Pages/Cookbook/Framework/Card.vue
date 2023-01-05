<template>
  <div class="card-root">
    <div class="dashboard">
      <div class="item">
        <Card
          title="Card Title"
          icon="fas fa-plane"
        >
          Content goes here
        </Card>

        <div class="info">Card</div>

        <Code
          lang="xml"
          :code="card"
        />
      </div>

      <div class="item">
        <Card :compact="true"> Content goes here </Card>

        <div class="info">Compact / no padding</div>

        <Code
          lang="xml"
          :code="cardCompact"
        />
      </div>

      <div
        class="item"
        style="grid-column: 1 / span 2"
      >
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

        <div class="info">Collapsible</div>

        <Code
          lang="xml"
          :code="cardCollapsible1"
        />

        <Code
          lang="typescript"
          :code="cardCollapsible2"
        />

        <Code
          lang="scss"
          :code="cardCollapsible3"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { $ref } from "vue/macros";
import { Card, Code, Collapsible } from "@/Framework";

const collapsed = $ref(false);

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

const cardCollapsible2 = `import { $ref } from "vue/macros";

const collapsed = $ref(false);
`;

const cardCollapsible3 = `::v-deep(.card-header) {
  .expander {
    transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(180deg);
    }
  }
}`;
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
@import "@/Pages/Cookbook/Cookbook.scss";

@include dashboard("card-root");

.card-root {
  .dashboard {
    row-gap: 3rem;
    column-gap: 1.5rem;
    grid-template-columns: 1fr 1fr;

    @include cookbook-item;

    ::v-deep(.card-header) {
      .expander {
        transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
        transform: rotate(90deg);

        &.expanded {
          transform: rotate(180deg);
        }
      }
    }
  }
}
</style>
