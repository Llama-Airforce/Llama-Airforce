export const collaterals = ["cbETH", "wstETH", "rETH", "sfrxETH"] as const;

export type Collateral = (typeof collaterals)[number];

export function icon(collateral: Collateral | "all") {
  if (collateral === "all") {
    return "";
  }

  const getLogo = (collateral: Collateral | "all") => {
    switch (collateral) {
      case "cbETH":
        return "cbeth.webp";
      case "wstETH":
        return "steth.webp";
      case "rETH":
        return "reth.webp";
      case "sfrxETH":
        return "frxeth.webp";
      default:
        return "";
    }
  };

  return `icons/tokens/${getLogo(collateral)}`;
}
