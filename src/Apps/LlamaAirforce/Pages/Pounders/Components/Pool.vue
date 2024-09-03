<script setup lang="ts">
const { name, logo, symbol, priceUnderlying } = defineProps<{
  name: string;
  logo: string;
  symbol: string;
  priceUnderlying: number | undefined;
}>();
</script>

<template>
  <div class="pool">
    <Tooltip>
      <template #trigger>
        <div class="pool-data">
          <img
            class="logo"
            :src="logo"
          />

          <span class="name">{{ name }}</span>
        </div>
      </template>

      <span v-if="priceUnderlying">
        {{ symbol }}:
        <AsyncValue
          :value="priceUnderlying"
          :precision="3"
          :show-zero="true"
          type="dollar"
        />
      </span>
    </Tooltip>
  </div>
</template>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";
.pool {
  flex-direction: row !important;
  justify-content: flex-start !important;
  color: var(--c-text);

  .pool-data {
    display: flex;
    align-items: center;
    font-size: 1rem;

    @media only screen and (max-width: 800px) {
      > .name {
        display: none;
      }
    }

    > .logo {
      object-fit: scale-down;
      height: 40px;
      margin-right: 1rem;
    }
  }
}
</style>
