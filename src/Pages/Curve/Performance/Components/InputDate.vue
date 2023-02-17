<template>
  <div class="container">
    <div class="label">{{ label }} </div>
    <div class="date-picker">
      <div id="year" class="field date-input">
        <div class="value">
          <InputNumber
            v-model="year"
            :placeholder="yearPlaceholder"
            :min="2020"
            :max="2100"
          ></InputNumber>
        </div>
      </div>
      <div id="month" class="field date-input">
        <div class="value">
          <InputNumber
            v-model="month"
            :placeholder="monthPlaceholder"
            :min="1"
            :max="12"
          ></InputNumber>
        </div>
      </div>
      <div id="day" class="field date-input">
        <div class="value">
          <InputNumber
            v-model="day"
            :placeholder="dayPlaceholder"
            :min="1"
            :max="31"
          ></InputNumber>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { $computed } from "vue/macros";
import { InputNumber } from "@/Framework";

// Props
interface Props {
  label?: string;
}

const {
  label = "",
} = defineProps<Props>();

const yearPlaceholder = $computed((): string => {
  return new Date().getFullYear().toString();
});

const monthPlaceholder = $computed((): string => {
  return (new Date().getMonth() + 1).toString();
});

const dayPlaceholder = $computed((): string => {
  return new Date().getDate().toString();
});
</script>

<style scoped>
.container {
  display: grid;
  grid-gap: 1rem;
}
.date-picker {
  display: flex;
  justify-content: left;
  gap: 0.5rem;

}
</style>

