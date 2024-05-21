<template>
  <Tooltip v-if="yieldsMax && market">
    <template #item>
      <span
        class="number delta"
        :class="{
          negative: yieldsMax.apy - market.rate * 100 < 0,
        }"
      >
        <AsyncValue
          :value="yieldsMax.apy - market.rate * 100"
          :precision="2"
          type="percentage"
        />
      </span>
    </template>

    <div class="premia">
      <span class="best">
        <em>Premia</em> for <strong>{{ market.name }}</strong> is max yield
        (<AsyncValue
          :value="yieldsMax.apy"
          :precision="2"
          type="percentage"
        />) from <strong>{{ yieldsMax.pool }}</strong> farmed on
        <strong>{{ yieldsMax.platform }}</strong> minus the borrow rate
        (<AsyncValue
          :value="market.rate * 100"
          :precision="2"
          type="percentage"
        />)
      </span>

      <div class="top">
        <strong>Top {{ yieldsTop.length }} yields: </strong>

        <div class="yields">
          <template
            v-for="(y, i) in yieldsTop"
            :key="i"
          >
            <div>{{ y.platform }}</div>
            <div>
              {{
                y.pool
                  .replace("Curve.fi", "")
                  .replace("Factory Plain Pool: ", "")
              }}
            </div>
            <div>
              <AsyncValue
                :value="y.apy"
                :precision="2"
                type="percentage"
              />
            </div>
          </template>
        </div>
      </div>
    </div>
  </Tooltip>
</template>

<script setup lang="ts">
import { chain } from "lodash";
import { type Market, type Yield } from "@CM/Services/CrvUsd";

// Props
interface Props {
  market: Market | undefined;
  yields: Yield[];
}

const { yields = [] } = defineProps<Props>();

const yieldsMax = computed(
  (): Yield | null =>
    chain(yields)
      .maxBy((x) => x.apy)
      .value() ?? null
);

const yieldsTop = computed((): Yield[] =>
  chain(yields)
    .orderBy((x) => x.apy, "desc")
    .take(5)
    .value()
);
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.premia {
  display: flex;
  flex-direction: column;
  gap: 1rem;

  > .top {
    display: flex;
    flex-direction: column;

    > .yields {
      display: grid;
      grid-template-columns: 1fr 1fr 1fr;

      > div {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 20ch;
      }
    }
  }
}
</style>
