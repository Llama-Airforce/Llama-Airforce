<template>
  <div class="vault">
    <ChartMarketRates :vault="vault"></ChartMarketRates>
  </div>
</template>


<script lang="ts">
import { defineComponent } from 'vue';
import {type TroveManagerDetails } from "@PM/Services/Socket/TroveOverviewService";

export default defineComponent({
  components: {
    //ChartMarketVolume,
  },
  props: {
    vault: {
      type: Object as () => TroveManagerDetails | null,
      required: true
    }
  }
});
</script>

<style lang="scss" scoped>
@import "@/Styles/Variables.scss";

@include dashboard("vault");

.vault {
  max-width: calc(1920px - 18.125rem);

  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-template-rows: 1fr 1fr;

@media only screen and (max-width: 1280px) {
  display: flex;
  flex-direction: column;
}
}
</style>
