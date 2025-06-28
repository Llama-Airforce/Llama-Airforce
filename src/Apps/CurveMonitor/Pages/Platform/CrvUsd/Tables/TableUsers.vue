<script setup lang="ts">
import type { MarketUser } from "@CM/queries/crvusd";

const { users } = defineProps<{
  users: MarketUser[];
}>();

const hardLiqable = ref(true);
const softLiqOnly = ref(false);
const { relativeTime } = useRelativeTime();

const columns = [
  "",
  { id: "user", label: "User", sort: false } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  { id: "stablecoin", label: "Stablecoin", sort: true, align: "end" } as const,
  { id: "loss", label: "Loss", sort: true, align: "end" } as const,
  {
    id: "health_full",
    label: "Health (Full)",
    sort: true,
    align: "end",
  } as const,
  { id: "softLiq", label: "Soft Liq", sort: false, align: "center" } as const,
  { id: "lastUpdate", label: "Last Update", sort: true, align: "end" } as const,
];

const { sorting, onSort } = useSort<typeof columns>("debt");

const usersFiltered = computed(() =>
  users
    .filter((user) => (!hardLiqable.value ? user.healthFull > 0 : true))
    .filter((user) => (softLiqOnly.value ? user.softLiquidation : true))
    .orderBy((user) => {
      switch (sorting.value.column) {
        case "debt":
          return user.debt;
        case "stablecoin":
          return user.stablecoin;
        case "loss":
          return user.loss;
        case "health_full":
          return user.healthFull;
        case "lastUpdate":
          return user.last.getTime();
      }
    }, sorting.value.order)
);

const rowsPerPage = 20;
const { page, rowsPage, onPage } = usePagination(usersFiltered, rowsPerPage);

const clipboard = async (addr: string) => {
  await navigator.clipboard.writeText(addr);
};
</script>

<template>
  <Card title="Users">
    <template #actions>
      <Pagination
        :items-count="usersFiltered.length"
        :items-per-page="rowsPerPage"
        :page
        @page="onPage"
      />
    </template>

    <template #actions-secondary>
      <div style="display: flex; gap: 1rem">
        <ButtonToggle
          :model-value="hardLiqable"
          @click="hardLiqable = !hardLiqable"
        >
          Hard Liq'able
        </ButtonToggle>

        <ButtonToggle
          :model-value="softLiqOnly"
          @click="softLiqOnly = !softLiqOnly"
        >
          Soft Liq Only
        </ButtonToggle>
      </div>
    </template>

    <Table
      :rows="rowsPage"
      :columns
      :sorting
      @sort-column="onSort"
    >
      <template #row="{ item: user }">
        <div>
          <Button @click="clipboard(user.user)">
            <LucideLink />
          </Button>
        </div>

        <div>
          <a
            target="_blank"
            :href="`https://etherscan.io/address/${user.user}`"
            @click.stop
          >
            {{ addressShort(user.user) }}
          </a>
        </div>

        <div class="end">
          <AsyncValue
            show-zero
            type="dollar"
            :value="user.debt"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="user.stablecoin > 0"
            show-zero
            type="dollar"
            :value="user.stablecoin"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            v-if="user.loss > 0"
            show-zero
            type="dollar"
            :value="user.loss"
            :precision="2"
          />
        </div>

        <div
          class="end"
          :class="{
            bad: user.healthFull <= 5,
            danger: user.healthFull <= 15 && user.healthFull > 5,
            good: user.healthFull > 15,
          }"
        >
          <AsyncValue
            show-zero
            type="percentage"
            :value="user.healthFull"
            :precision="2"
          />
        </div>

        <div
          class="center"
          @click.stop
        >
          <Checkbox
            readonly
            :model-value="user.softLiquidation"
          />
        </div>

        <div class="end">
          {{ relativeTime(user.last.getUTCTimestamp()) }}
        </div>
      </template>
    </Table>
  </Card>
</template>

<style scoped>
.table {
  --columns-data: auto 8rem minmax(6rem, 1fr) minmax(6rem, 1fr)
    minmax(6rem, 1fr) minmax(6rem, 1fr) minmax(3rem, 1fr) 8rem;
}

.bad {
  color: var(--c-red);
}

.danger {
  color: var(--c-yellow);
}

.good {
  color: var(--c-green);
}
</style>
