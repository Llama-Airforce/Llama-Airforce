<template>
  <DataTable
    class="datatable-match"
    columns-header="1fr"
    columns-data="match-columns-data"
    :rows="epochsSorted"
    :columns="['', t('deadline'), t('native'), t(`frax`), t('total')]"
    :sorting="true"
    :sorting-columns="['', 'deadline', 'native', 'frax', 'total']"
    :sorting-columns-enabled="['deadline', 'native', 'frax', 'total']"
    sorting-default-column="deadline"
    sorting-default-dir="Descending"
    @sort-column="onSort"
  >
    <template #row="props: { item: EpochFrax }">
      <Tooltip>
        <template #item>
          <div class="tooltip-match-columns-data">
            <div class="round-number">
              <a
                :href="voteLink(props.item)"
                target="_blank"
                class="vote-link"
              >
                <span v-if="isFinished(props.item)">{{
                  round(props.item)
                }}</span>
                <span v-else>
                  <Tooltip icon="far fa-clock"> {{ t("ongoing") }} </Tooltip>
                </span>
              </a>
            </div>
            <div>
              {{ date(props.item) }}
            </div>
            <div class="number">
              <AsyncValue
                :value="native(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
            <div class="number">
              <AsyncValue
                :value="frax(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
            <div class="number">
              <AsyncValue
                :value="total(props.item)"
                :precision="2"
                type="dollar"
              />
            </div>
          </div>
        </template>

        <div class="bribes">
          <!-- <ul>
            <li
              v-for="(bribe, i) in bribes(props.item)"
              :key="i"
            >
              <div>{{ bribe.token }}</div>
              <div>
                <AsyncValue
                  :value="bribe.amountDollars"
                  :precision="2"
                  type="dollar"
                />
              </div>
              <div>
                <AsyncValue
                  :value="bribe.amount"
                  :precision="2"
                  :show-symbol="false"
                  type="dollar"
                />
              </div>
            </li>
          </ul> -->
          {{ t("no-breakdown") }}
        </div>
      </Tooltip>
    </template>
  </DataTable>
</template>

<script setup lang="ts">
import { $ref, $computed } from "vue/macros";
import { useI18n } from "vue-i18n";
import AsyncValue from "@/Framework/AsyncValue.vue";
import DataTable from "@/Framework/DataTable.vue";
import Tooltip from "@/Framework/Tooltip.vue";
import { SortOrder } from "@/Framework/SortOrder";
import { orderBy } from "lodash";
import { getDate, getDateRaw, getLink } from "@/Pages/Bribes/Util/EpochHelper";
import type { Bribe } from "@/Pages/Bribes/Models/Bribe";
import type { EpochFrax } from "@/Pages/Bribes/FraxMatch/Models/EpochFrax";

// Props
interface Props {
  epochs: EpochFrax[];
}

const { t } = useI18n();

const { epochs = [] } = defineProps<Props>();

// Refs
let sortColumn: "deadline" | "native" | "frax" | "total" = $ref("deadline");
let sortOrder: SortOrder = $ref(SortOrder.Descending);

const epochsSorted = $computed((): EpochFrax[] => {
  return orderBy(
    epochs,
    (epoch: EpochFrax) => {
      switch (sortColumn) {
        case "deadline":
          return epoch.round;
        case "native":
          return native(epoch);
        case "frax":
          return frax(epoch);
        case "total":
          return total(epoch);
        default:
          return epoch.round;
      }
    },
    sortOrder === SortOrder.Descending ? "desc" : "asc"
  );
});

// Methods
const round = (epoch: EpochFrax): number => {
  return epoch.round;
};

const voteLink = (epoch: EpochFrax): string => {
  return getLink(epoch, epoch.proposal);
};

const native = (epoch: EpochFrax): number => {
  return epoch.native;
};

const frax = (epoch: EpochFrax): number => {
  return epoch.frax;
};

const total = (epoch: EpochFrax): number => {
  return native(epoch) + frax(epoch);
};

const date = (epoch: EpochFrax): string => {
  return getDate(epoch);
};

const isFinished = (epoch: EpochFrax): boolean => {
  return new Date() > getDateRaw(epoch);
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars
const bribes = (epoch: EpochFrax): Bribe[] => {
  if (!epoch) {
    return [];
  }

  return [
    {
      pool: "",
      token: "FXS",
      amount: 5,
      amountDollars: 10,
    },
  ];
};

// Events
const onSort = (columnName: string, order: SortOrder): void => {
  sortColumn = columnName as "deadline" | "native" | "frax" | "total";
  sortOrder = order;
};
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-match {
  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  ::v-deep(.match-columns-data) {
    display: grid;
    grid-template-columns: 1.5rem 1fr 1fr 1fr 1fr;

    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }

  ::v-deep(.tooltip) {
    grid-column: 1 / span 5;
    display: flex;
    height: 100%;
    align-items: center;

    > div {
      display: flex;
      flex-grow: 1;
      height: 100%;
      align-items: center;

      > div {
        display: flex;
        flex-grow: 1;
        height: 100%;
        align-items: center;

        > .tooltip-match-columns-data {
          flex-grow: 1;
          display: grid;
          grid-template-columns: 1.5rem 1fr 1fr 1fr 1fr;
          grid-column-gap: 1rem;

          // Right adjust number columns.
          div:nth-child(3),
          div:nth-child(4),
          div:nth-child(5) {
            justify-content: end;
          }
        }
      }
    }

    > .popper {
      height: auto;

      > .bribes {
        > ul {
          display: flex;
          flex-direction: column;
          padding: 0;
          margin: 0;
          list-style-type: none;

          > li {
            display: grid;
            grid-template-columns: 1fr 1fr 1fr;
            grid-gap: 1rem;

            > div {
              display: flex;
            }
          }
        }
      }
    }
  }
}
</style>

<i18n lang="yaml" locale="en">
deadline: Deadline
native: Native
frax: Frax
total: Total
ongoing: Ongoing
no-breakdown: No token breakdown yet
</i18n>
