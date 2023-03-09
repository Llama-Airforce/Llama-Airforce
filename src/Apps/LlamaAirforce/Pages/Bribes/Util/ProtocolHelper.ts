import type { Protocol } from "@LAF/Pages/Bribes/Models";

export function vlAssetSymbol(protocol: Protocol | null | undefined): string {
  switch (protocol) {
    case "cvx-crv":
      return "vlCVX";
    case "aura-bal":
      return "vlAURA";
    default:
      return "vl???";
  }
}
