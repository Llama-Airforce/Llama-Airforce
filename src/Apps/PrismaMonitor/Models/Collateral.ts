export const collaterals = ["cbETH", "wstETH", "rETH", "sfrxETH"] as const;

export type Collateral = (typeof collaterals)[number];

export function icon(collateral: Collateral) {
  const getLogo = (collateral: Collateral) => {
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
