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
export function useTabNavigation<T extends string>(
  tabs: readonly T[],
  routeName: string,
  routeParams?: () => Record<string, unknown>
) {
  const router = useRouter();
  const tabActive = useRouteParams<T>("tab", tabs[0]);
  const tabActiveIndex = ref(-1);

  watch(
    tabActive,
    (newTab) => {
      const tabIndex = tabs.findIndex((tab) => tab === newTab);
      tabActiveIndex.value = tabIndex !== -1 ? tabIndex : 0;
    },
    { immediate: true }
  );

  watch(
    tabActiveIndex,
    async (newTabIndex) => {
      await router.push({
        name: routeName,
        params: { tab: tabs[newTabIndex], ...(routeParams?.() ?? {}) },
      });
    },
    { immediate: true }
  );

  return { tabActive, tabActiveIndex };
}
