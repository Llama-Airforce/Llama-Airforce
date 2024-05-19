export const collateralsLsd = ["cbETH", "wstETH", "rETH", "sfrxETH"] as const;
export const collateralsLrt = ["weETH", "ezETH", "rsETH"] as const;
export const collaterals = [...collateralsLsd, ...collateralsLrt] as const;

export type Collateral = (typeof collaterals)[number];

import cbETH from "@/Assets/Icons/Tokens/cbeth.webp";
import wstETH from "@/Assets/Icons/Tokens/steth.webp";
import rETH from "@/Assets/Icons/Tokens/reth.webp";
import sfrxETH from "@/Assets/Icons/Tokens/frxeth.webp";

import weETH from "@/Assets/Icons/Tokens/weeth.webp";
import ezETH from "@/Assets/Icons/Tokens/ezeth.svg";
import rsETH from "@/Assets/Icons/Tokens/rseth.svg";

export function icon(collateral: Collateral) {
  const mapping: Record<Collateral, string> = {
    cbETH,
    wstETH,
    rETH,
    sfrxETH,
    weETH,
    ezETH,
    rsETH,
  };

  return mapping[collateral];
}
