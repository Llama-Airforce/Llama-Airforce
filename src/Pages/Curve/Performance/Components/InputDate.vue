<template>
  <div class="container">
    <div class="label">{{ label }}</div>
    <div class="date-picker">
      <div
        id="year"
        class="field date-input"
      >
        <div class="value">
          <InputNumber
            v-model="year"
            :placeholder="yearPlaceholder"
            :min="2020"
            :max="2100"
            @input="emitDateIfValid"
          ></InputNumber>
        </div>
      </div>

      <div
        id="month"
        class="field date-input"
      >
        <div class="value">
          <InputNumber
            v-model="month"
            :placeholder="monthPlaceholder"
            :min="1"
            :max="12"
            @input="emitDateIfValid"
          ></InputNumber>
        </div>
      </div>

      <div
        id="day"
        class="field date-input"
      >
        <div class="value">
          <InputNumber
            v-model="day"
            :placeholder="dayPlaceholder"
            :min="1"
            :max="31"
            @input="emitDateIfValid"
          ></InputNumber>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref } from "vue";
import { InputNumber } from "@/Framework";

// Props
interface Props {
  label?: string;
}

const { label = "" } = defineProps<Props>();

const yearPlaceholder = computed((): string => {
  return new Date().getFullYear().toString();
});

const monthPlaceholder = computed((): string => {
  return (new Date().getMonth() + 1).toString();
});

const dayPlaceholder = computed((): string => {
  return new Date().getDate().toString();
});

const year = ref(2023);
const month = ref(1);
const day = ref(1);

// Events
const emitDateIfValid = (): void => {
  const date = new Date(year.value, month.value - 1, day.value);
  if (!isNaN(date.getTime())) {
    // The date is valid, emit it as an event
    emit("date-selected", date);
  } else {
    // The date is invalid, emit null as an event
    emit("date-selected", null);
  }
};

// Emits
const emit = defineEmits<{
  (e: "date-selected", data: Date | null): void;
}>();
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
