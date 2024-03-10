export const collateralsLsd = ["cbETH", "wstETH", "rETH", "sfrxETH"] as const;
export const collateralsLrt = ["weETH", "ezETH", "rsETH"] as const;
export const collaterals = [...collateralsLsd, ...collateralsLrt] as const;

export type Collateral = (typeof collaterals)[number];

export function icon(collateral: Collateral) {
  const getLogo = (collateral: Collateral) => {
    switch (collateral) {
      // LSD
      case "cbETH":
        return "cbeth.webp";
      case "wstETH":
        return "steth.webp";
      case "rETH":
        return "reth.webp";
      case "sfrxETH":
        return "frxeth.webp";

      // LRT
      case "weETH":
        return "weeth.webp";
      case "ezETH":
        return "ezeth.svg";
      case "rsETH":
        return "rseth.svg";

      default:
        return "";
    }
  };

  return `icons/tokens/${getLogo(collateral)}`;
}
