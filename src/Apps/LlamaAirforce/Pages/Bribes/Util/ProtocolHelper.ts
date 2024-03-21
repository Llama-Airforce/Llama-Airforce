import type { Protocol } from "@LAF/Pages/Bribes/Models";

export function vlAssetSymbol(protocol: Protocol | null | undefined): string {
  switch (protocol) {
    case "cvx-crv":
    case "cvx-prisma":
    case "cvx-fxn":
      return "vlCVX";
    case "aura-bal":
      return "vlAURA";
    default:
      return "vl???";
  }
}
