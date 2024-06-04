export const chains = [
  "ethereum",
  "arbitrum",
  "optimism",
  "fantom",
  "avalanche",
  "xdai",
  "matic",
  "harmony",
  "moonbeam",
  "base",
  "polygon",
  "fraxtal",
] as const;

export type Chain = (typeof chains)[number];

import ethereum from "@/Assets/Icons/Chains/ethereum.svg";
import avalanche from "@/Assets/Icons/Chains/avalanche.svg";
import arbitrum from "@/Assets/Icons/Chains/arbitrum.png";
import fantom from "@/Assets/Icons/Chains/fantom.svg";
import xdai from "@/Assets/Icons/Chains/xdai.png";
import harmony from "@/Assets/Icons/Chains/harmony.svg";
import moonbeam from "@/Assets/Icons/Chains/moonbeam.png";
import matic from "@/Assets/Icons/Chains/matic.svg";
import optimism from "@/Assets/Icons/Chains/optimism.png";

import base from "@/Assets/Icons/Chains/base.webp";
import polygon from "@/Assets/Icons/Chains/polygon.png";
import fraxtal from "@/Assets/Icons/Chains/fraxtal.png";

export function icon(chain: Chain | "all"): string {
  const mapping: Record<Chain | "all", string> = {
    ethereum,
    arbitrum,
    optimism,
    fantom,
    avalanche,
    xdai,
    matic,
    harmony,
    moonbeam,
    base,
    polygon,
    fraxtal,
    all: "",
  };

  return mapping[chain];
}
