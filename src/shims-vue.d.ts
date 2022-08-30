/* eslint-disable */
declare module "*.vue" {
  import type { DefineComponent } from "vue";
  const component: DefineComponent<{}, {}, any>;
  export default component;
}

declare module "vue3-popper" {
  import { Component } from "vue";
  const file: Component;
  export default file;
}

declare module "*.json" {
  const value: { [key: string]: any };
  export default value;
}
