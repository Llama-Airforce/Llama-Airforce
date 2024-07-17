<template>
  <DataTable
    class="datatable-match"
    :rows="epochsSorted"
    :columns
    :sorting
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
import { orderBy } from "lodash";
import {
  getDate,
  getDateRaw,
  getLink,
} from "@LAF/Pages/Bribes/Util/EpochHelper";
import type { Bribe } from "@LAF/Pages/Bribes/Models";
import type { EpochFrax } from "@LAF/Pages/Bribes/FraxMatch/Models/EpochFrax";

const { t } = useI18n();

// Props
interface Props {
  epochs: EpochFrax[];
}

const { epochs = [] } = defineProps<Props>();

// Refs
const columns = computed(() => [
  "",
  { id: "deadline" as const, label: t("deadline"), sort: true as const },
  { id: "native" as const, label: t("native"), sort: true as const },
  { id: "frax" as const, label: t("frax"), sort: true as const },
  { id: "total" as const, label: t("total"), sort: true as const },
]);

const { sorting, onSort } = useSort<typeof columns.value>("deadline");

const epochsSorted = computed((): EpochFrax[] => {
  return orderBy(
    epochs,
    (epoch: EpochFrax) => {
      switch (sorting.value.column) {
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
    sorting.value.order
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
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.datatable-match {
  --columns-data: 1.5rem 1fr 1fr 1fr 1fr;

  .round-number {
    display: flex;
    justify-content: center;
    align-items: center;
  }

  :deep(.row-data) {
    // Right adjust number columns.
    div:nth-child(3),
    div:nth-child(4),
    div:nth-child(5) {
      justify-content: end;
    }
  }

  :deep(.tooltip) {
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
          align-items: center;

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
