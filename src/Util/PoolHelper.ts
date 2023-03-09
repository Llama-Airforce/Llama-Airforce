import { GaugeId } from "@/Apps/LlamaAirforce/Pages/Curve/Gauges/Models/Gauge";
import { invert } from "lodash";

const poolNameMapping: Record<string, string> = {
  "Curve.fi Factory USD Metapool: Magic Internet Money 3Pool": "mim",
  "Curve.fi Factory Plain Pool: cvxCRV": "cvxcrv",
  "Curve.fi Factory Plain Pool: ibJPY-sJPY": "ibJPY/sJPY",
  "Curve.fi Factory Plain Pool: ibGBP-sGBP": "ibGBP/sGBP",
  "Curve.fi Factory Plain Pool: ibAUD-sAUD": "ibAUD/sAUD",
  "Curve.fi Factory Plain Pool: ibEUR-sEUR": "ibEUR/sEUR",
  "Curve.fi Factory Plain Pool: ibCHF-sCHF": "ibCHF/sCHF",
  "Curve.fi Factory Plain Pool: ibKRW-sKRW": "ibKRW/sKRW",
  ib: "ironbank",
  aeth: "ankreth",
  "Curve.fi Factory USD Metapool: USDM": "usdm",
  "Curve.fi Factory Plain Pool: Neutrino EUR": "eurn",
  "Curve.fi Factory Pool: alETH": "aleth",
  "Curve.fi Factory Plain Pool: MIM-UST": "mim-ust",
  "Curve.fi Factory BTC Metapool: ibBTCT": "ibBTCT",
  "Curve.fi Factory USD Metapool: Paxos Dollar (USDP)": "paxos-dollar",
  "Curve.fi Factory Plain Pool: d3pool": "d3pool",
  "Curve.fi Factory USD Metapool: Origin Dollar": "ousd",
  "Curve.fi Factory USD Metapool: wormhole v2 UST-3Pool": "wormhole-ust",
  "Curve.fi Factory BTC Metapool: ibBTC": "ibBTC",
  "Curve.fi Factory Plain Pool: 3EURpool": "3eur-pool",
  "Curve EURS-USDC": "eursusdc",
  "Curve EURT-3Crv": "eurtusd",
  "Curve CVX-ETH": "cvx",
  "Curve CRV-ETH": "crv",
  RAI3CRV: "rai",
  "Curve XAUT-3Crv": "xaut",
  "Curve.fi Factory USD Metapool: DOLA-3pool Curve LP": "dola",
  "Curve T-ETH": "teth",
  "Curve.fi Factory Crypto Pool: YFI-ETH": "yfieth",
  "Curve SPELL-ETH": "spelleth",
  "Curve.fi Factory Crypto Pool: FXS-ETH": "fxseth",
  "Curve.fi Factory USD Metapool: FEI Metapool": "FEI Metapool",
  "Curve.fi Factory Plain Pool: agEUR-ibEUR": "agEUR/ibEUR",
  "Curve.fi Factory BTC Metapool: tbtc2": "tbtc2",
};

const poolIconMapping: Record<string, string> = {
  steth: "steth",
  "Curve.fi Factory USD Metapool: Magic Internet Money 3Pool": "mim",
  "Curve.fi Factory Plain Pool: MIM-UST": "mim",
  tricrypto2: "tricrypto2",
  "3pool": "3pool",
  ib: "cream",
  usdn: "usdn",
  ren: "ren",
  alusd: "alusd",
  frax: "frax",
  ironbank: "ironbank",
  pbtc: "pbtc",
  bbtc: "bbtc",
  sbtc: "sbtc",
  obtc: "obtc",
  compound: "comp",
  ankreth: "ankreth",
  saave: "aave",
  aeth: "aeth",
  tbtc: "tbtc",
  usdp: "usdp",
  "Curve.fi Factory Plain Pool: cvxCRV": "crv",
  eurs: "eurs",
  lusd: "lusd",
  seth: "seth",
  hbtc: "hbtc",
  aave: "aave",
  link: "link",
  susd: "susd",
  eurt: "eurt",
  busdv2: "busd",
  reth: "reth",
  "Curve.fi Factory Plain Pool: ibCHF-sCHF": "chf",
  gusd: "gusd",
  "Curve.fi Factory Plain Pool: ibGBP-sGBP": "gbp",
  tricrypto: "tricrypto",
  busd: "busd",
  y: "yfi",
  "Curve.fi Factory Plain Pool: ibJPY-sJPY": "jpy",
  "Curve.fi Factory Plain Pool: ibAUD-sAUD": "aud",
  "Curve.fi Factory Plain Pool: ibEUR-sEUR": "eur",
  "Curve.fi Factory Plain Pool: ibKRW-sKRW": "krw",
  tusd: "tusd",
  dusd: "dusd",
  ust: "ust",
  rsv: "rsv",
  musd: "musd",
  husd: "husd",
  usdt: "usdt",
  usdk: "usdk",
  pax: "pax",
  "Curve.fi Factory Pool: alETH": "alusd",
  "Curve.fi Factory USD Metapool: USDM": "usdm",
  "Curve.fi Factory Plain Pool: Neutrino EUR": "eur",
  "Curve.fi Factory Plain Pool: 3EURpool": "3eur-pool",
  "Curve EURS-USDC": "eurs",
  "Curve EURT-3Crv": "eurt",
  "Curve.fi Factory USD Metapool: Origin Dollar": "ousd",
  "Curve.fi Factory USD Metapool: wormhole v2 UST-3Pool": "ust",
  "Curve.fi Factory BTC Metapool: ibBTC": "ibbtc",
  "Curve.fi Factory USD Metapool: Paxos Dollar (USDP)": "paxos-usdp",
  "Curve.fi Factory Plain Pool: d3pool": "d3pool",
  "Curve.fi Factory BTC Metapool: tbtc2": "tbtc2",
  "Curve.fi Factory USD Metapool: DOLA-3pool Curve LP": "dola",
  "Curve CVX-ETH": "cvx",
  "Curve CRV-ETH": "crv",
  RAI3CRV: "rai",
  "Curve XAUT-3Crv": "xaut",
  "Curve T-ETH": "t",
  "Curve.fi Factory Crypto Pool: YFI-ETH": "yfi",
  "Curve SPELL-ETH": "spell",
  "Curve.fi Factory Crypto Pool: FXS-ETH": "fxs",
  "Curve.fi Factory USD Metapool: FEI Metapool": "fei",
};

const poolIconMappingVotium: Record<string, string> = {
  "f-ustw": "ust",
  "f-d3pool": "d3pool",
  eursusd: "stasis",
  "crv-eth": "crv",
  "ust-wormhole": "ust",
  "fixedforex:chf": "chf",
  "fixedforex:gbp": "gbp",
  "fixedforex:jpy": "jpy",
  "fixedforex:aud": "aud",
  "fixedforex:eur": "eur",
  "fixedforex:krw": "krw",
  rai: "rai",
  cvxeth: "cvx",
  "3eur": "3eur-pool",
  teth: "t",
  "f-fei": "fei",
  cvxfxs: "fxs",
  "avalanche-f-3pool": "3pool",
  "fantom-f-4POOL": "3pool",
};

const poolIconMappingVotiumNew: Record<string, string> = {
  "f-cadcusdc":
    "https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xcadc0acd4b445166f12d2c07eac6e2544fbe2eef.png",
  "f-pwrd":
    "https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xf0a93d4994b3d98fb5e3a2f90dbc2d69073cb86b.png",
  "f-lfteth":
    "https://cdn.jsdelivr.net/gh/curvefi/curve-assets/images/assets/0xb620be8a1949aa9532e6a3510132864ef9bc3f82.png",
};

const poolsDisabled: GaugeId[] = ["tricrypto", "usdm"];

export function shorten(poolName: GaugeId): string {
  const nameShort = poolNameMapping[poolName];

  return nameShort ? nameShort : poolName;
}

export function longen(poolNameShort: GaugeId): string {
  const nameLong = invert(poolNameMapping)[poolNameShort];

  return nameLong ? nameLong : poolNameShort;
}

export function disabled(poolNameShort: GaugeId): boolean {
  return !!(
    poolsDisabled.find((x) => x === poolNameShort) ||
    poolsDisabled.find((x) => x === shorten(poolNameShort)) ||
    poolsDisabled.find((x) => x === longen(poolNameShort))
  );
}

export function icon(poolNameShort: GaugeId, why = true): string {
  let icon =
    poolIconMapping[poolNameShort] ??
    poolIconMapping[shorten(poolNameShort)] ??
    poolIconMapping[longen(poolNameShort)] ??
    poolIconMappingVotium[poolNameShort] ??
    "";

  icon = icon
    ? `/pool-icons.svg#${icon}`
    : poolIconMappingVotiumNew[poolNameShort];

  return icon || (why ? "/why.png" : "empty.png");
}
