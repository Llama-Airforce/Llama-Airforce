import type { InjectionKey } from "vue";
import type { Theme } from "@/Styles/Theme";

const ThemeSymbol = Symbol() as InjectionKey<Ref<Theme>>;

export function provideTheme(theme: Ref<Theme>) {
  provide(ThemeSymbol, theme);
}

export function useTheme(): Ref<Theme> {
  const theme = inject<Ref<Theme>>(ThemeSymbol);
  if (!theme) throw new Error("Theme not provided");
  return theme;
}
