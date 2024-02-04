import { type Collateral, icon as iconF } from "@PM/Models/Collateral";

export const vaults = [
  "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2", // cbETH
  "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f", // wstETH (long term)
  "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6", // wstETH (short term)
  "0xe0e255fd5281bec3bb8fa1569a20097d9064e445", // rETH
  "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483", // sfrxETH (long term)
  "0xc2545c68a71f6803264bde885870fd72d361fb9e", // sfrxETH (short term)
] as const;

export type Vault = (typeof vaults)[number];

export function collateral(vault: Vault): Collateral | null {
  switch (vault) {
    case "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2":
      return "cbETH";
    case "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f":
    case "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6":
      return "wstETH";
    case "0xe0e255fd5281bec3bb8fa1569a20097d9064e445":
      return "rETH";
    case "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483":
    case "0xc2545c68a71f6803264bde885870fd72d361fb9e":
      return "sfrxETH";
    default:
      return null;
  }
}

export function icon(vault: Vault) {
  const coll = collateral(vault)!;
  return iconF(coll as Collateral);
}

export function label(vault: Vault): string | null {
  switch (vault) {
    case "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2":
      return "cbETH";
    case "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f":
      return "wstETH (long term)";
    case "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6":
      return "wstETH (short term)";
    case "0xe0e255fd5281bec3bb8fa1569a20097d9064e445":
      return "rETH";
    case "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483":
      return "sfrxETH (long term)";
    case "0xc2545c68a71f6803264bde885870fd72d361fb9e":
      return "sfrxETH (short term)";
    default:
      return null;
  }
}
