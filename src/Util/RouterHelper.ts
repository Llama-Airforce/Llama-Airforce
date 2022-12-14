import { RouteLocationNormalizedLoaded } from "vue-router";

export function subIsActive(
  input: string,
  route: RouteLocationNormalizedLoaded
): boolean {
  const paths = Array.isArray(input) ? input : [input];

  return paths.some((path) => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    return route.path.indexOf(path) === 0; // current path starts with this path string
  });
}
