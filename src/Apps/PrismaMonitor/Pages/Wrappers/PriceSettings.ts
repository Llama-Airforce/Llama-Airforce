import { type OHLCRequestSettings } from "@/Services";
import { type Contract } from "@PM/Services";

export function getPriceSettings(contract: Contract): OHLCRequestSettings {
  const end = Math.floor(new Date().getTime() / 1000);
  const interval = 14400;
  const start = end - interval * 299; // Max 300 points, one less for safety.

  switch (contract) {
    case "convex":
      return {
        pool: "0x3b21C2868B6028CfB38Ff86127eF22E68d16d53B",
        chain: "ethereum",
        main_token: "0xdA47862a83dac0c112BA89c6abC2159b95afd71C",
        reference_token: "0x34635280737b5BFe6c7DC2FC3065D60d66e78185",
        interval,
        start,
        end,
      };
    case "yearn":
      return {
        pool: "0x69833361991ed76f9e8DBBcdf9ea1520fEbFb4a7",
        chain: "ethereum",
        main_token: "0xdA47862a83dac0c112BA89c6abC2159b95afd71C",
        reference_token: "0xe3668873D944E4A949DA05fc8bDE419eFF543882",
        interval,
        start,
        end,
      };
    default:
      throw new Error("Unknown contract");
  }
}
