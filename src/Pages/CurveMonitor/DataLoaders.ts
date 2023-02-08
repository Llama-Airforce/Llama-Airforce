import { Subscription } from "rxjs";
import { useCurveMonitorStore } from "@/Pages/CurveMonitor/Store";
import {
  PoolService,
  BalanceService,
  PriceService,
  VolumeService,
  TransactionService,
  TvlService,
  BondingService,
} from "@/Pages/CurveMonitor/Services";
import { createSocketPool } from "@/Pages/CurveMonitor/Services/Sockets";

export function loadPool(
  store: ReturnType<typeof useCurveMonitorStore>,
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

  void getTransactions(store, transactionService);
  void getPrices(store, priceService);
  void getBalances(store, balanceService);
  void getTvl(store, tvlService);
  void getVolumes(store, volumeService);
  void getBondings(store, bondingService);

  socketPool.connect();

  return socketPool;
}

export async function getPools(
  store: ReturnType<typeof useCurveMonitorStore>,
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
  store: ReturnType<typeof useCurveMonitorStore>,
  service: BalanceService
) {
  // Unsubscribe from from existing subscriptions.
  if (balances$_) {
    balances$_.unsubscribe();
  }

  try {
    balances$_ = service.get$.subscribe({
      next: (balances) => {
        store.addBalances(balances);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let tvl$_: Subscription | null = null;
function getTvl(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TvlService
) {
  // Unsubscribe from from existing subscriptions.
  if (tvl$_) {
    tvl$_.unsubscribe();
  }

  try {
    tvl$_ = service.get$.subscribe({
      next: (tvl) => {
        store.addTvl(tvl);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let prices$_: Subscription | null = null;
function getPrices(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: PriceService
) {
  // Unsubscribe from from existing subscriptions.
  if (prices$_) {
    prices$_.unsubscribe();
  }

  try {
    prices$_ = service.get$.subscribe({
      next: (price) => {
        store.addPrice(price);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let volumes$_: Subscription | null = null;
function getVolumes(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: VolumeService
) {
  // Unsubscribe from from existing subscriptions.
  if (volumes$_) {
    volumes$_.unsubscribe();
  }

  try {
    volumes$_ = service.get$.subscribe({
      next: (volume) => {
        store.addVolume(volume);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let txs$_: Subscription | null = null;
function getTransactions(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: TransactionService
) {
  // Unsubscribe from from existing subscriptions.
  if (txs$_) {
    txs$_.unsubscribe();
  }

  try {
    txs$_ = service.get$.subscribe({
      next: (tx) => {
        store.addTransaction(tx);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}

let bondings$_: Subscription | null = null;
function getBondings(
  store: ReturnType<typeof useCurveMonitorStore>,
  service: BondingService
) {
  // Unsubscribe from from existing subscriptions.
  if (bondings$_) {
    bondings$_.unsubscribe();
  }

  try {
    bondings$_ = service.get$.subscribe({
      next: (bonding) => {
        store.addBonding(bonding);
      },
      error: (err) => console.error(err),
    });
  } catch (err) {
    store.poolsLoadingError = true;
  }
}
