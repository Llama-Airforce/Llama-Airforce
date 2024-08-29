import { type Crumb } from "@/Framework/Crumb";

export const useBreadcrumbStore = defineStore("breadcrumbStore", () => {
  const crumbs = ref<Crumb[]>([]);
  const show = ref(false);

  return {
    crumbs,
    show,
  };
});
