import type { Crumb } from "@/Framework/Types/Crumb";

export const useBreadcrumbStore = defineStore("breadcrumbStore", () => {
  const route = useRoute();
  const router = useRouter();

  const crumbs = ref<Crumb[]>([]);
  const show = ref(false);

  watch(
    () => route.fullPath,
    () => {
      show.value = route.meta.crumbs ?? false;
    }
  );

  const onCrumb = async (crumb: Crumb) => {
    if (crumb.pathName) {
      await router.push({
        name: crumb.pathName,
        ...(crumb.params && { params: crumb.params() }),
      });
    }
  };

  return {
    crumbs,
    show,
    onCrumb,
  };
});
