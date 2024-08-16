type GaugeId = string;

function invert(x: Record<string, string>) {
  return Object.fromEntries(Object.entries(x).map(([k, v]) => [v, k]));
}

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
    poolsDisabled.find((x) => x === poolNameShort) ??
    poolsDisabled.find((x) => x === shorten(poolNameShort)) ??
    poolsDisabled.find((x) => x === longen(poolNameShort))
  );
}
