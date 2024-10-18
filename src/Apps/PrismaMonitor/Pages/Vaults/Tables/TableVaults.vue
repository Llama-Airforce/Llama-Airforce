<script setup lang="ts">
import { icon, label, isDeprecated } from "@PM/Models/Vault";
import { useSocketStore, useSettingsStore, getApiSocket } from "@PM/Stores";
import { type TroveManagerDetails, TroveOverviewService } from "@PM/Services";

const { t } = useI18n();

const emit = defineEmits<{
  selected: [vault: TroveManagerDetails];
}>();

// Stores
const storeSettings = useSettingsStore();

// Services
const socket = useSocketStore().getSocket(getApiSocket(storeSettings.flavor));
const prismaService = new TroveOverviewService(socket, "ethereum");

// Refs
const search = ref("");

const rowsRaw = useObservable(prismaService.overview$, []);

const rows = computed(() =>
  rowsRaw.value
    .filter((row) => {
      const terms = search.value.toLocaleLowerCase().split(" ");

      const includesTerm = (x: string) =>
        terms.some((term) => x.toLocaleLowerCase().includes(term));

      return includesTerm(row.name) || includesTerm(row.address);
    })
    .orderBy((row) => row.debt, "desc")
);

const loading = computed(() => rowsRaw.value.length === 0);
</script>

<template>
  <Card
    class="vaults-card"
    :title="t('title')"
    :loading
  >
    <template #actions>
      <InputText
        v-model="search"
        search
        :placeholder="t('search-placeholder')"
      >
      </InputText>
    </template>

    <Table
      class="vaults-table"
      :rows
      :columns="[
        '',
        'Name',
        { label: 'TVL', align: 'end' },
        { label: 'Debt', align: 'end' },
        { label: 'CR', align: 'end' },
        { label: 'MCR', align: 'end' },
        { label: 'Troves', align: 'end' },
        { label: 'Price', align: 'end' },
      ]"
      @selected="emit('selected', $event)"
    >
      <template #row="{ item }">
        <img :src="icon(item.address)" />
        <div :class="{ deprecated: isDeprecated(item.address) }">
          {{ label(item.address) ?? item.name }}
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          <AsyncValue
            type="dollar"
            :value="item.tvl"
            :precision="0"
            :show-symbol="false"
          />
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          <AsyncValue
            type="dollar"
            :value="item.debt"
            :precision="0"
            :show-symbol="false"
          />
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          <AsyncValue
            type="percentage"
            :value="item.cr * 100"
            :precision="2"
          />
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          <AsyncValue
            type="percentage"
            :value="item.mcr * 100"
            :precision="2"
          />
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          {{ item.open_troves }}
        </div>

        <div
          class="end"
          :class="{ deprecated: isDeprecated(item.address) }"
        >
          <AsyncValue
            type="dollar"
            :value="Math.round(item.price)"
            :precision="Infinity"
          ></AsyncValue>
        </div>
      </template>

      <template #row-aggregation>
        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.tvl, 0)"
            :precision="0"
            :show-symbol="false"
          />
        </div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.debt, 0)"
            :precision="0"
            :show-symbol="false"
          />
        </div>

        <div></div>
        <div></div>

        <div class="end">
          <AsyncValue
            type="dollar"
            :value="rows.reduce((acc, x) => acc + x.open_troves, 0)"
            :precision="0"
            :show-symbol="false"
          />
        </div>

        <div></div>
      </template>

      <!-- Empty for expander arrow and pointer on hover -->
      <template #row-details> &nbsp; </template>
    </Table>
  </Card>
</template>

<style scoped>
.vaults-card {
  --header-column-title: minmax(7rem, 1fr);
  --header-column-actions: minmax(auto, 25rem);
}

.vaults-table {
  --columns-data: 20px minmax(12ch, 1fr) repeat(6, minmax(11ch, 0.75fr)) 1rem;

  .deprecated {
    opacity: 0.5;
  }

  img {
    width: 20px;
    height: 20px;
    object-fit: scale-down;
  }
}
</style>

<i18n lang="yaml" locale="en">
title: Vaults

search-placeholder: Search for...
</i18n>
