<template>
  <div
    class="kpi"
    :class="{ disabled: !hasValue }"
  >
    <div
      class="value-container"
      :class="{ underline: tooltip && tooltipType === 'underline' }"
    >
      <slot>
        <Tooltip v-if="tooltip && tooltipType === 'underline'">
          <template #item>
            <span
              v-if="hasValue"
              class="value"
            >
              {{ value }}
            </span>

            <span
              v-else
              class="value"
            >
              ?
            </span>
          </template>

          <slot name="tooltip">
            <span v-html="tooltip"></span>
          </slot>
        </Tooltip>

        <template v-else>
          <span
            v-if="hasValue"
            class="value"
          >
            {{ value }}
          </span>

          <span
            v-else
            class="value"
          >
            ?
          </span>
        </template>
      </slot>

      <Tooltip v-if="tooltip && tooltipType === 'icon'">
        <span v-html="tooltip"></span>
      </Tooltip>
    </div>

    <div class="labels">
      <slot name="label">
        <div class="label">{{ label }}</div>
      </slot>

      <slot name="label-second">
        <div class="label-second">{{ labelSecond }}</div>
      </slot>
    </div>
  </div>
</template>

<script setup lang="ts">
import Tooltip from "@/Framework/Tooltip.vue";

// Props
interface Props {
  label?: string;
  labelSecond?: string;
  tooltip?: string;
  tooltipType?: "icon" | "underline";
  value?: unknown;
  hasValue?: boolean;
}

const {
  label = "",
  labelSecond = "",
  tooltip = "",
  tooltipType = "icon",
  value,
  hasValue = false,
} = defineProps<Props>();
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

.kpi {
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;
  justify-content: space-around;

  line-height: 1.5rem;
  padding: 0.75rem;

  background: $background-color-widget;

  @media only screen and (max-width: 1280px) {
    padding: 0.75rem 1rem;
    line-height: 1.25rem;
  }

  > .labels {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    > .label,
    > .label-second {
      color: #a1a1aa;
      font-size: 0.75rem;
    }
  }

  .value-container,
  .value {
    display: flex;
    justify-content: space-between;
    align-items: center;

    color: white;
    font-size: 1.25rem;
    font-weight: bold;

    &.underline {
      border-bottom: dotted 2px lighten(#303034, 12%);
    }

    .tooltip {
      color: $text;
      text-align: center;
      font-weight: normal;
    }
  }

  &.disabled {
    > .label,
    > .value {
      color: lighten(rgb(20, 20, 20), 60%);
    }
  }
}
</style>
