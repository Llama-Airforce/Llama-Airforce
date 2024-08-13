import { type Subscription } from "rxjs";
import { type useMonitorStore } from "@CM/Pages/Platform/MonitorLegacy/Store";
import {
  type PoolService,
  CoinService,
  PairService,
  BalanceService,
  PriceService,
  VolumeService,
  TransactionService,
  TvlService,
  BondingService,
  createSocketPool,
} from "@CM/Services/MonitorLegacy";

export function loadPool(
  store: ReturnType<typeof useMonitorStore>,
  host: string,
  pool: string
): ReturnType<typeof createSocketPool> {
  const socketPool = createSocketPool(host, pool);

  const volumeService = new VolumeService(socketPool);
  const priceService = new PriceService(socketPool);
  const transactionService = new TransactionService(socketPool);
  const balanceService = new BalanceService(socketPool);
  const tvlService = new TvlService(socketPool);
  const bondingService = new BondingService(socketPool);
  const coinService = new CoinService(socketPool);
  const pairService = new PairService(socketPool);

  getTransactions(store, transactionService);
  getPrices(store, priceService);
  getBalances(store, balanceService);
  getTvl(store, tvlService);
  getVolumes(store, volumeService);
  getBondings(store, bondingService);
  getCoins(store, coinService);
  getPair(store, pairService);

  socketPool.connect();

  return socketPool;
}

export async function getPools(
  store: ReturnType<typeof useMonitorStore>,
  service: PoolService,
  input: string
) {
  const resp = await service.get(input);

  if (resp) {
    store.pools = resp;
  } else {
    store.poolsLoadingError = true;
  }
}

let balances$_: Subscription | null = null;
function getBalances(
  store: ReturnType<typeof useMonitorStore>,
  service: BalanceService
) {
  if (balances$_) {
    balances$_.unsubscribe();
  }

  try {
    balances$_ = service.init$.subscribe({
      next: (balances) => {
        store.balances = balances;
      },
      error: (err) => {
        console.error(err);
      },
    });

    balances$_.add(
      service.update$.subscribe({
        next: (balances) => {
          store.balances.push(balances);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  } catch {
    store.poolsLoadingError = true;
  }
}

let tvl$_: Subscription | null = null;
function getTvl(
  store: ReturnType<typeof useMonitorStore>,
  service: TvlService
) {
  // Unsubscribe from from existing subscriptions.
  if (tvl$_) {
    tvl$_.unsubscribe();
  }

  try {
    tvl$_ = service.init$.subscribe({
      next: (tvls) => {
        store.tvl = tvls;
      },
      error: (err) => {
        console.error(err);
      },
    });

    tvl$_.add(
      service.update$.subscribe({
        next: (tvl) => {
          store.tvl.push(tvl);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  } catch {
    store.poolsLoadingError = true;
  }
}

let prices$_: Subscription | null = null;
function getPrices(
  store: ReturnType<typeof useMonitorStore>,
  service: PriceService
) {
  // Unsubscribe from from existing subscriptions.
  if (prices$_) {
    prices$_.unsubscribe();
  }

  try {
    prices$_ = service.init$.subscribe({
      next: (prices) => {
        store.prices = prices;
      },
      error: (err) => {
        console.error(err);
      },
    });

    prices$_.add(
      service.update$.subscribe({
        next: (price) => {
          store.prices.push(price);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  } catch {
    store.poolsLoadingError = true;
  }
}

let volumes$_: Subscription | null = null;
function getVolumes(
  store: ReturnType<typeof useMonitorStore>,
  service: VolumeService
) {
  // Unsubscribe from from existing subscriptions.
  if (volumes$_) {
    volumes$_.unsubscribe();
  }

  try {
    volumes$_ = service.init$.subscribe({
      next: (volumes) => {
        store.volumes = volumes;
      },
      error: (err) => {
        console.error(err);
      },
    });

    volumes$_.add(
      service.update$.subscribe({
        next: (volume) => {
          store.volumes.push(volume);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  } catch {
    store.poolsLoadingError = true;
  }
}

let txs$_: Subscription | null = null;
function getTransactions(
  store: ReturnType<typeof useMonitorStore>,
  service: TransactionService
) {
  // Unsubscribe from from existing subscriptions.
  if (txs$_) {
    txs$_.unsubscribe();
  }

  try {
    txs$_ = service.init$.subscribe({
      next: (txs) => {
        store.transactions = txs;
      },
      error: (err) => {
        console.error(err);
      },
    });

    txs$_.add(
      service.update$.subscribe({
        next: (tx) => {
          store.transactions.push(tx);
        },
        error: (err) => {
          console.error(err);
        },
      })
    );
  } catch {
    store.poolsLoadingError = true;
  }
}

let bondings$_: Subscription | null = null;
function getBondings(
  store: ReturnType<typeof useMonitorStore>,
  service: BondingService
) {
  // Unsubscribe from from existing subscriptions.
  if (bondings$_) {
    bondings$_.unsubscribe();
  }

  try {
    bondings$_ = service.get$.subscribe({
      next: (bonding) => {
        store.bonding = bonding;
      },
      error: (err) => {
        console.error(err);
      },
    });
  } catch {
    store.poolsLoadingError = true;
  }
}

let coins$_: Subscription | null = null;
function getCoins(
  store: ReturnType<typeof useMonitorStore>,
  service: CoinService
) {
  // Unsubscribe from from existing subscriptions.
  if (coins$_) {
    coins$_.unsubscribe();
  }

  try {
    coins$_ = service.get$.subscribe({
      next: (coins) => {
        store.coins = coins;
      },
      error: (err) => {
        console.error(err);
      },
    });
  } catch {
    store.poolsLoadingError = true;
  }
}

let pair$_: Subscription | null = null;
function getPair(
  store: ReturnType<typeof useMonitorStore>,
  service: PairService
) {
  // Unsubscribe from from existing subscriptions.
  if (pair$_) {
    pair$_.unsubscribe();
  }

  try {
    pair$_ = service.update$.subscribe({
      next: (pair) => {
        store.pair = pair;
      },
      error: (err) => {
        console.error(err);
      },
    });
  } catch {
    store.poolsLoadingError = true;
  }
}
