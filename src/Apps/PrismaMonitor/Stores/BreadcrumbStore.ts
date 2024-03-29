import { defineStore } from "pinia";
import { type Crumb } from "@/Framework";

type State = {
  crumbs: Crumb[];
  show: boolean;
};

export const useBreadcrumbStore = defineStore({
  id: "breadcrumbStore",
  state: (): State => ({
    crumbs: [],
    show: false,
  }),
});
