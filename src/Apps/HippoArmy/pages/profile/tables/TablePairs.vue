<script setup lang="ts">
import { usePairsEthereum } from "@HA/queries/protocols";
import { usePositions } from "@HA/queries/user";
import { pairName } from "@HA/util";

// User
const { address } = useAccount();
const user = useRouteQuery<string | undefined>("user", address.value);
const inputAddressRef = useTemplateRef("inputAddress");
const inputValue = ref(user.value ?? "");
let initialized = false;

const pairId = useRouteQuery<number | undefined>("pairId", undefined, {
  transform: Number,
});

const { query } = useRoute();

const { data: allPairs } = usePairsEthereum();

// Handle user selection from InputAddress
function onNewUser(address: string | undefined) {
  delete query.pairId;

  if (address) {
    user.value = address;
  } else {
    delete query.userAddress;
  }

  inputValue.value = address ?? "";
  if (inputAddressRef.value) {
    inputAddressRef.value.selected = address ?? "";
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
  "",
  "",
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

const hasHistorical = computed(
  () => (pairs.value?.historical ?? []).length > 0
);
const tabActiveIndex = ref(0);

const rows = computed(() =>
  (
    (tabActiveIndex.value === 0
      ? pairs.value?.active
      : pairs.value?.historical) ?? []
  )
    .orderBy((x) => {
      switch (sorting.value.column) {
        case "pairName":
          return pairName(x.pairName);
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
    .map((x) => ({
      ...x,
      tokenPairCollateral: allPairs.value.find(
        (pair) => pair.name === x.pairName
      )?.tokenPairCollateral,
    }))
);

// Selection
const selected = useRouteQuery<number | undefined>("pairId", undefined, {
  transform: Number,
});
const values = computed(() => rows.value.map((x) => x.pairId));
</script>

<template>
  <Card :loading>
    <template #title>
      Markets
      <TabView
        v-if="hasHistorical"
        :active="tabActiveIndex"
        @tab="tabActiveIndex = $event.index"
      >
        <TabItem header="Active" />
        <TabItem header="Historical" />
      </TabView>
    </template>

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

        <div class="tokens">
          <TokenIcon
            v-if="item.tokenPairCollateral"
            :key="item.tokenPairCollateral.symbol"
            chain="ethereum"
            :address="item.tokenPairCollateral.address"
          />
        </div>

        <div>{{ pairName(item.pairName) }}</div>

        <div class="end">
          <AsyncValue
            type="percentage"
            :value="item.collateralRatio * 100"
            :precision="0"
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
      v-else-if="!loading && user"
      :message="`User ${addressShort(
        user
      )} has not participated in any positions`"
    />

    <NoData
      v-else-if="!loading"
      message="Enter an address or ENS to view market pairs"
    />
  </Card>

  <NoData
    v-if="!loading && !pairId && rows.length > 0"
    class="select-pair"
    message="Select a pair to view user analytics"
  />
</template>

<style scoped>
.table {
  --columns-data: 1rem calc(1 * (26px + 1ch)) minmax(12ch, 1fr)
    minmax(6rem, 0.25fr) minmax(6rem, 0.25fr) minmax(6rem, 0.25fr) 10rem;
}

.select-pair {
  margin-top: var(--dashboard-gap);
}

.token {
  display: flex;
  justify-content: center;
  align-items: center;
}

.input-address {
  min-width: 64ch;

  @media only screen and (max-width: 1280px) {
    min-width: 48ch;
  }
}

.card:deep(.card-title) {
  display: flex;
  gap: 1rem;
  align-items: center;
}
</style>
