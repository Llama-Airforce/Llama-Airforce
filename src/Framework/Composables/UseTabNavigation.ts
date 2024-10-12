/**
 * Vue composable for tab navigation.
 *
 * This composable provides a convenient way to handle router tab navigation within a Vue component.
 * It takes an array of tab names, a route name, and an optional function to generate route params.
 *
 * The composable returns:
 * - `tabActive`: a ref containing the currently active tab name from the 'tab' route param.
 * - `tabActiveIndex`: a ref containing the index of the currently active tab
 *
 * When the active tab changes, the composable automatically updates the `tabActiveIndex` ref
 * and navigates to the corresponding route using Vue Router.
 *
 * Note: The reason `tabActiveIndex` is a ref and not a computed property is because it can be
 * set from outside the component to control the active tab programmatically. Once updated,
 * the router will be pushed to reflect the change.
 *
 * @param tabs An array of tab names
 * @param routeName The name of the route to navigate to when a tab is selected
 * @param routeParams An optional function that returns additional route params to include in the navigation
 * @returns An object containing `tabActive` and `tabActiveIndex` refs
 */
export function useTabNavigation<const T extends string>(
  tabs: readonly T[],
  routeName: string,
  routeParams?: () => Record<string, unknown>
) {
  const router = useRouter();
  const tabActive = useRouteParams<T>("tab", tabs[0]);
  const tabActiveIndex = ref(-1);

  watch(
    tabActive,
    (tabActive) =>
      (tabActiveIndex.value = tabs.findIndex((tab) => tab === tabActive)),
    { immediate: true }
  );

  watch(
    tabActiveIndex,
    async (tabActiveIndex, oldIndex) => {
      // When tab couldn't be found, default to the first avilable tab.
      if (tabActiveIndex === -1) {
        tabActiveIndex = 0;
      }

      const replace =
        oldIndex === -1 || oldIndex === undefined || tabActive.value === "";

      await router.push({
        name: routeName,
        params: { tab: tabs[tabActiveIndex], ...(routeParams?.() ?? {}) },
        replace,
      });
    },
    { immediate: true }
  );

  return { tabActive, tabActiveIndex };
}
