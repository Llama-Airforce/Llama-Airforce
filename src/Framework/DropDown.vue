<template>
  <select
    class="dropdown-list"
    :placeholder="placeholder"
  >
    <option
      v-for="(option, index) in options"
      :key="index"
      :value="option"
    >
      {{ option }}
    </option>
  </select>
</template>

<script
  setup
  lang="ts"
>
// Props
interface Props {
  placeholder: string;
  options?: string[];
}

const { placeholder = "mainnet", options = [] } = defineProps<Props>();
</script>

<style
  lang="scss"
  scoped
>
@import "@/Styles/Variables.scss";
.dropdown-list {
  display: flex;
  flex-grow: 1;
  color: $text;
  background: $datatable-background;
  height: 1.5rem;
  border: solid 2px #35353b;
  padding: 0.1rem 0.5rem;
  position: relative;
  width: 100%;
  text-align: left;
  outline: none;
  line-height: 1.5rem;
  cursor: pointer;

  > select {
  }
  > option {
    color: $text;
    margin: 3px;
    padding: 6px 8px;
    background-color: $datatable-background;
  }
}
</style>
