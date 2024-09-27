<script setup lang="ts">
import Recipe from "@CB/Recipe.vue";

const collapsed = ref(false);

const card = `<Card title="Card Title">
  Content goes here
</Card>`;

const cardCompact = `<Card :compact="true">
  Content goes here
</Card>`;

const cardLoading = `<Card
  title="Card Loading"
  :loading="true"
>
  Content goes here
</Card>`;

const cardWithActions = `<template>
<Card title="Card with Actions">
  <template #actions>
    <div style="display: flex; gap: 1rem">
      <Button class="primary">Export</Button>
      <Button class="primary">Fullscreen</Button>
    </div>
  </template>

  <template #actions-secondary>
    <div>Secondary Actions</div>
  </template>

  Content goes here
</Card>
</template>`;

const cardCollapsible = `<template>
  <Card
    title="Card Title"
    :collapsible="true"
    :collapsed="collapsed"
    @click="collapsed = !collapsed"
  >
    <template #actions>
      <LucideChevronUp
        class="expander"
        :class="{ expanded: !collapsed }"
      ></LucideChevronUp>
    </template>

    <Collapsible :expanded="!collapsed"> Content goes here </Collapsible>
  </Card>
</template>

<script setup lang="ts">
const collapsed = ref(false);

const handleToggle = (event) => {
  // Toggle logic here
};
<\/script>

<style scoped>
.card {
  .expander {
    transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(180deg);
    }
  }
}
</style>
`;
</script>

<template>
  <div class="dashboard">
    <Recipe title="Basic Card">
      <template #example>
        <Card title="Card Title"> Content goes here </Card>
      </template>

      <template #snippets>
        <Code
          lang="vue"
          :code="card"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Compact Card">
      <template #example>
        <Card :compact="true"> Content goes here </Card>
      </template>

      <template #snippets>
        <Code
          lang="vue"
          :code="cardCompact"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Collapsible Card">
      <template #example>
        <Card
          title="Card Title"
          :collapsible="true"
          :collapsed="collapsed"
          @click="collapsed = !collapsed"
        >
          <template #actions>
            <LucideChevronUp
              class="expander"
              :class="{ expanded: !collapsed }"
            />
          </template>

          <Collapsible :expanded="!collapsed"> Content goes here </Collapsible>
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="vue"
          :code="cardCollapsible"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Card with Actions">
      <template #example>
        <Card
          class="card-with-actions"
          title="Card with Actions"
        >
          <template #actions>
            <div style="display: flex; gap: 1rem">
              <Button class="primary">Export</Button>
              <Button class="primary">Fullscreen</Button>
            </div>
          </template>

          <template #actions-secondary>
            <div>Secondary Actions</div>
          </template>

          Content goes here
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="vue"
          :code="cardWithActions"
        ></Code>
      </template>
    </Recipe>

    <Recipe title="Loading Card">
      <template #example>
        <Card
          title="Card Loading"
          :loading="true"
        >
          Content goes here
        </Card>
      </template>

      <template #snippets>
        <Code
          lang="vue"
          :code="cardLoading"
        ></Code>
      </template>
    </Recipe>
  </div>
</template>

<style scoped>
.dashboard {
  column-gap: var(--dashboard-gap, 1.5rem);
  grid-template-columns: 1fr 1fr;

  .expander {
    transition: transform 125ms cubic-bezier(0.65, 0.05, 0.36, 1);
    transform: rotate(90deg);

    &.expanded {
      transform: rotate(180deg);
    }
  }
}
</style>
