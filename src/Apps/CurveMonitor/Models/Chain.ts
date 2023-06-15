export const chains = [
  "mainnet",
  "arbitrum",
  "optimism",
  "fantom",
  "avalanche",
  "xdai",
  "matic",
  "harmony",
  "moonbeam",
] as const;

export type Chain = typeof chains[number];

export function icon(chain: Chain | "all"): string {
  if (chain === "all") {
    return "";
  }

  const getLogo = (chain: Chain | "all") => {
    switch (chain) {
      case "mainnet":
        return "mainnet.svg";
      case "avalanche":
        return "avalanche.svg";
      case "arbitrum":
        return "arbitrum.png";
      case "fantom":
        return "fantom.svg";
      case "xdai":
        return "xdai.png";
      case "harmony":
        return "harmony.svg";
      case "moonbeam":
        return "moonbeam.png";
      case "matic":
        return "matic.svg";
      case "optimism":
        return "optimism.png";
      default:
        return "";
    }
  };

  return `icons/chains/${getLogo(chain)}`;
}
