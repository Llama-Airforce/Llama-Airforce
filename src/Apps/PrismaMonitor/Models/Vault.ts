import { type Collateral, icon as iconF } from "@PM/Models/Collateral";

export const vaultsLsd = [
  "0x2ee8fca637d4b0bdb402c2735ea55ef6976c25db", // cbETH
  "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2", // cbETH (deprecated)
  "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6", // wstETH
  "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f", // wstETH (deprecated)
  "0x0d6741f1a3a538f78009ca2e3a13f9cb1478b2d0", // rETH
  "0xe0e255fd5281bec3bb8fa1569a20097d9064e445", // rETH (deprecated)
  "0xc2545c68a71f6803264bde885870fd72d361fb9e", // sfrxETH
  "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483", // sfrxETH (deprecated)
] as const;

export const vaultsLrt = [
  "0x1691308554c0a5a37c87e947677a4d31b9c97da9", // weETH
  "0xf1c45c7b1f798302d29390d90d4dac38137352b1", // weETH (deprecated)
  "0x1ad10ee3284297afcf2f6a41f935300cbebcf70d", // ezETH
  "0x585d78a00d1be2e95f75b20935d4b8d3c36efef1", // ezETH (deprecated)
  "0x335849a1c359e83dca508101bd394a9d12e176b9", // rsETH
  "0xdb3080920ee1df720411e12c16ec3866a8c2f5c6", // rsETH (deprecated)
] as const;

export const vaults = [...vaultsLsd, ...vaultsLrt] as const;

export type Vault = (typeof vaults)[number];

export function collateral(vault: Vault): Collateral | null {
  switch (vault) {
    // LSD
    case "0x2ee8fca637d4b0bdb402c2735ea55ef6976c25db":
    case "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2":
      return "cbETH";
    case "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6":
    case "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f":
      return "wstETH";
    case "0x0d6741f1a3a538f78009ca2e3a13f9cb1478b2d0":
    case "0xe0e255fd5281bec3bb8fa1569a20097d9064e445":
      return "rETH";
    case "0xc2545c68a71f6803264bde885870fd72d361fb9e":
    case "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483":
      return "sfrxETH";

    // LRT
    case "0x1691308554c0a5a37c87e947677a4d31b9c97da9":
    case "0xf1c45c7b1f798302d29390d90d4dac38137352b1":
      return "weETH";
    case "0x1ad10ee3284297afcf2f6a41f935300cbebcf70d":
    case "0x585d78a00d1be2e95f75b20935d4b8d3c36efef1":
      return "ezETH";
    case "0x335849a1c359e83dca508101bd394a9d12e176b9":
    case "0xdb3080920ee1df720411e12c16ec3866a8c2f5c6":
      return "rsETH";

    default:
      return null;
  }
}

export function icon(vault: Vault) {
  const coll = collateral(vault)!;
  return iconF(coll);
}

export function label(vault: Vault): string | null {
  switch (vault) {
    // LSD
    case "0x2ee8fca637d4b0bdb402c2735ea55ef6976c25db":
      return "cbETH";
    case "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2":
      return "cbETH (deprecated)";
    case "0x1cc79f3f47bfc060b6f761fcd1afc6d399a968b6":
      return "wstETH";
    case "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f":
      return "wstETH (deprecated)";
    case "0x0d6741f1a3a538f78009ca2e3a13f9cb1478b2d0":
      return "rETH";
    case "0xe0e255fd5281bec3bb8fa1569a20097d9064e445":
      return "rETH (deprecated)";
    case "0xc2545c68a71f6803264bde885870fd72d361fb9e":
      return "sfrxETH";
    case "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483":
      return "sfrxETH (deprecated)";

    // LRT
    case "0x1691308554c0a5a37c87e947677a4d31b9c97da9":
      return "weETH";
    case "0xf1c45c7b1f798302d29390d90d4dac38137352b1":
      return "weETH (deprecated)";
    case "0x1ad10ee3284297afcf2f6a41f935300cbebcf70d":
      return "ezETH";
    case "0x585d78a00d1be2e95f75b20935d4b8d3c36efef1":
      return "ezETH (deprecated)";
    case "0x335849a1c359e83dca508101bd394a9d12e176b9":
      return "rsETH";
    case "0xdb3080920ee1df720411e12c16ec3866a8c2f5c6":
      return "rsETH (deprecated)";

    default:
      return null;
  }
}

export function isDeprecated(vault: Vault): boolean {
  return [
    // LSD
    "0x63cc74334f4b1119276667cf0079ac0c8a96cfb2",
    "0xbf6883a03fd2fcfa1b9fc588ad6193b3c3178f8f",
    "0xe0e255fd5281bec3bb8fa1569a20097d9064e445",
    "0xf69282a7e7ba5428f92f610e7afa1c0cedc4e483",

    // LRT
    "0xf1c45c7b1f798302d29390d90d4dac38137352b1",
    "0x585d78a00d1be2e95f75b20935d4b8d3c36efef1",
    "0xdb3080920ee1df720411e12c16ec3866a8c2f5c6",
  ].includes(vault);
}
