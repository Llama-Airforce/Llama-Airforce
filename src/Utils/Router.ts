import type { RouteLocationNormalizedLoaded } from "vue-router";

export function subIsActive(
  input: string | string[],
  route: RouteLocationNormalizedLoaded
): boolean {
  const paths = Array.isArray(input) ? input : [input];

  return paths.some(
    (path) => route.path.startsWith(path) // current path starts with this path string
  );
}
