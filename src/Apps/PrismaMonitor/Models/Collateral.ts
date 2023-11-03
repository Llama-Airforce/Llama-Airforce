export const collaterals = ["cbETH", "wstETH", "rETH", "sfrxETH"] as const;

export type Collateral = (typeof collaterals)[number];

export function fromAddress(addr: string): Collateral {
  switch (addr.toLocaleLowerCase()) {
    case "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2":
      return "cbETH";
    case "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f":
      return "wstETH";
    case "0xe0e255fd5281bec3bb8fa1569a20097d9064e445":
      return "rETH";
    case "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483":
      return "sfrxETH";
    default:
      throw new Error(`Unknown collateral for ${addr}`);
  }
}

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
