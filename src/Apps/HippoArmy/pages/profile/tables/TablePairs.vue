<script setup lang="ts">
import { usePositions } from "@HA/queries/user";

// User
const { address } = useAccount();
const user = useRouteQuery<string>("user", address.value ?? "");
const inputAddressRef = useTemplateRef("inputAddress");
const inputValue = ref(user.value);
let initialized = false;

// Handle user selection from InputAddress
function onNewUser(address: string) {
  user.value = address;
  inputValue.value = address;

  if (inputAddressRef.value) {
    inputAddressRef.value.selected = address;
  }
}

// Sync wallet changes to user after initial load
whenever(address, (address) => {
  if (!initialized && !!user.value) {
    initialized = true;
    return;
  }

  onNewUser(address);
});

watch(user, onNewUser);

const { isFetching: loading, data: pairs } = usePositions(
  computed(() => ({
    user_address: user.value,
  }))
);

const columns = [
  { id: "pairName", label: "Pair", sort: true } as const,
  {
    id: "collateralRatio",
    label: "Collateral Ratio",
    sort: true,
    align: "end",
  } as const,
  { id: "underlying", label: "Collateral", sort: true, align: "end" } as const,
  { id: "debt", label: "Debt", sort: true, align: "end" } as const,
  {
    id: "lastUpdated",
    label: "Last Updated",
    sort: true,
    align: "end",
  } as const,
];

const { sorting, onSort } = useSort<typeof columns>("debt");

const rows = computed(() =>
  (pairs.value?.active ?? []).orderBy((x) => {
    switch (sorting.value.column) {
      case "pairName":
        return x.pairName;
      case "collateralRatio":
        return x.collateralRatio;
      case "underlying":
        return x.underlying;
      case "debt":
        return x.debt;
      case "lastUpdated":
        return x.lastSnapshotDate.getTime();
    }
  }, sorting.value.order)
);

// Selection
const selected = useRouteQuery<number | undefined>("pairId", undefined);
const values = computed(() => rows.value.map((x) => x.pairId));
</script>

<template>
  <Card
    title="Markets"
    :loading
  >
    <template #actions>
      <InputAddress
        ref="inputAddress"
        v-model="inputValue"
        @select="onNewUser($event.address)"
      />
    </template>

    <Table
      v-if="rows.length > 0"
      :rows
      :columns
      :sorting
      :selected-row="rows.find((x) => x.pairId === selected)"
      @sort-column="onSort"
      @select="selected = $event.pairId"
    >
      <template #row="{ item }">
        <div class="center">
          <RadioButton
            v-model="selected"
            name="redemption"
            :values
            :value="item.pairId"
          />
        </div>

        <div>{{ item.pairName }}</div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.collateralRatio"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.underlying"
            :precision="2"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="item.debt"
            :precision="2"
          />
        </div>

        <div class="end">{{ item.lastSnapshotDate.toLocaleString() }}</div>
      </template>
    </Table>

    <NoData
      v-else-if="!loading"
      :message="`User ${addressShort(
        user
      )} has not participated in any positions`"
    />
  </Card>
</template>

<style scoped>
.table {
  --col-width: 11ch;
  --columns-data: 1rem minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr) minmax(var(--col-width), 0.75fr)
    minmax(var(--col-width), 0.75fr);
}

.input-address {
  min-width: 64ch;

  @media only screen and (max-width: 1280px) {
    min-width: 48ch;
  }
}
</style>
