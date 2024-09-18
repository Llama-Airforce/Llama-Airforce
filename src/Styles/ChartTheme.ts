import type { Colors } from "@/Styles/Colors";

/**
 * Reactive reference to the color scheme used for charts.
 * Initial values are set to grey to indicate any theme loading problems.
 */
export const colors = shallowRef<Colors>({
  blue: "#aaa",
  yellow: "#aaa",
  green: "#aaa",
  red: "#aaa",
  purple: "#aaa",

  backgroundColor: "#aaa",
  level1: "#aaa",
  level2: "#aaa",
  level3: "#aaa",
  level4: "#aaa",
  level5: "#aaa",
  level6: "#aaa",

  text: "#aaa",
});

/**
 * Observes changes to the document's theme and updates the color scheme accordingly.
 * This allows for dynamic theme switching without page reload.
 */
useMutationObserver(
  document.documentElement,
  (mutations) => {
    // Only proceed if the data-theme attribute has changed
    if (!mutations.some((m) => m.attributeName === "data-theme")) {
      return;
    }

    const style = getComputedStyle(document.documentElement);
    const getColor = (prop: string) => colorToHex(style.getPropertyValue(prop));

    // Update the colors ref with new values from CSS variables
    colors.value = {
      blue: getColor("--c-chart-blue"),
      yellow: getColor("--c-chart-yellow"),
      green: getColor("--c-chart-green"),
      red: getColor("--c-chart-red"),
      purple: getColor("--c-chart-purple"),

      text: getColor("--c-chart-text"),

      backgroundColor: getColor("--c-lvl1"),
      level1: getColor("--c-lvl1"),
      level2: getColor("--c-lvl2"),
      level3: getColor("--c-lvl3"),
      level4: getColor("--c-lvl4"),
      level5: getColor("--c-lvl5"),
      level6: getColor("--c-lvl6"),
    };
  },
  { attributes: true }
);

/**
 * Converts a color string to its hexadecimal representation.
 *
 * @param color - The color string to convert. Can be any valid CSS color value.
 * @returns The hexadecimal representation of the color.
 * @throws {Error} If the 2D canvas context cannot be created.
 */
function colorToHex(color: string): string {
  const canvas = document.createElement("canvas");
  canvas.width = 1;
  canvas.height = 1;

  // Get the canvas context
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Failed to create 2D canvas context");
  }

  // Set the fill style to the CSS color and the canvas with the color
  ctx.fillStyle = color;
  ctx.fillRect(0, 0, 1, 1);

  // Get the color data of the pixel (will be in rgba format)
  const rgba = ctx.getImageData(0, 0, 1, 1).data;

  // Convert the rgba to hex
  const hex = `#${[rgba[0], rgba[1], rgba[2]]
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("")}`;

  return hex;
}
