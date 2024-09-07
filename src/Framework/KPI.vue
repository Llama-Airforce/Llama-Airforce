<script setup lang="ts">
const {
  label = "",
  labelSecond = "",
  tooltip = "",
  tooltipType = "icon",
  value,
  hasValue = false,
} = defineProps<{
  label?: string;
  labelSecond?: string;
  tooltip?: string;
  tooltipType?: "icon" | "underline";
  value?: string | number;
  hasValue?: boolean;
}>();
</script>

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
          <template #trigger>
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

<style lang="scss" scoped>
.kpi {
  display: flex;
  flex-direction: column;
  flex-basis: 0;
  flex-grow: 1;
  justify-content: space-around;

  line-height: 1.5;
  padding: 0.75rem;

  background: var(--c-lvl1);
  border-radius: var(--border-radius);
  box-shadow: var(--container-box-shadow);

  @media only screen and (max-width: 1280px) {
    padding: 0.75rem 1rem;
  }

  > .labels {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;

    > .label,
    > .label-second {
      color: var(--c-lvl5);
      font-size: 0.75rem;
    }
  }

  .value-container,
  .value {
    position: relative;

    display: flex;
    justify-content: space-between;
    align-items: center;

    color: var(--c-text);
    font-size: 1.25rem;
    font-weight: bold;

    &.underline {
      > ::after {
        content: "";
        position: absolute;
        margin: auto;
        right: 0;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 1px;
        background-color: transparent;
        border-bottom: 2px dotted var(--c-lvl3-active);
      }
    }

    .tooltip {
      color: var(--c-text);
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
