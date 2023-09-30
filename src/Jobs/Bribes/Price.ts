/* eslint-disable indent */
import * as O from "fp-ts/Option";
import * as TE from "fp-ts/TaskEither";
import * as TO from "fp-ts/TaskOption";
import { pipe } from "fp-ts/function";
import { type Network } from "@/Jobs/Bribes/Network";
import { getPrice as getDefiLlamaPrice } from "@/Jobs/Bribes/DefiLlama";
import { getPriceAtTime as getCoinGeckoPrice } from "@/Jobs/Bribes/CoinGecko";
import { chainLeft, log } from "@/Jobs/Bribes/fp";

const Tokens = {
  sdFXS: "0x402f878bdd1f5c66fdaf0fababcf74741b68ac36",
  T: "0xcdf7028ceab81fa0c6971208e83fa7872994bee5",
  eCFX: "0xa1f82e14bc09a1b42710df1a8a999b62f294e592",
};

const CurveV1LP = {
  FXSsdFXS: "0x8c524635d52bd7b1bd55e062303177a7d916c046",
};

const CurveV2LP = {
  TETH: "0x752ebeb79963cf0732e9c0fec72a49fd1defaeac",
  eCFXETH: "0x5ac4fcee123dcadfae22bc814c4cc72b96c93f38",
};

/** Fallback token address for tokens in case coingecko price fetching fails. */
function fallbackTokenAddress(tokenSymbol: string): O.Option<string> {
  switch (tokenSymbol) {
    case "LUNA":
      return O.some("0xd2877702675e6ceb975b4a1dff9fb7baf4c91ea9");
    case "GEIST":
      return O.some("0xd8321aa83fb0a4ecd6348d4577431310a6e0814d");
    default:
      return O.none;
  }
}

/** Mapping for tokens and their respective ETH LP pair for Curve V1. */
function curveV1LpAddress(tokenAddr: string): O.Option<string> {
  switch (tokenAddr) {
    case Tokens.sdFXS:
      return O.some(CurveV1LP.FXSsdFXS);
    default:
      return O.none;
  }
}

/** Last attempt fallback values for tokens in case coingecko price fetching fails. */
function fallbackManual(tokenSymbol: string): TO.TaskOption<number> {
  switch (tokenSymbol) {
    case "USDM":
    case "BB-A-USD":
      return TO.some(1);
    // TODO: T, eCFX and sdFXS using Curve V1 and V2 LPs.
    default:
      return TO.none;
  }
}

/** Mapping for tokens and their respective ETH LP pair for Curve V2. */
function curveV2LpAddress(tokenAddr: string): O.Option<string> {
  switch (tokenAddr) {
    case Tokens.T:
      return O.some(CurveV2LP.TETH);
    case Tokens.eCFX:
      return O.some(CurveV2LP.eCFXETH);
    default:
      return O.none;
  }
}

/** Mapping for tokens that are not on Ethereum by default. */
export function getNetwork(tokenSymbol: string): Network {
  switch (tokenSymbol) {
    case "GEIST":
      return "fantom";
    default:
      return "ethereum";
  }
}

export function getPrice(
  tokenAddr: string,
  network: Network,
  date?: Date,
  tokenSymbol?: string
): TE.TaskEither<Error, number> {
  date ??= new Date();

  // If a fallback symbol is given, check if it has a fallback address and convert to TE.
  const fallback = (err: Error) =>
    pipe(
      O.fromNullable(tokenSymbol),
      O.chain(fallbackTokenAddress),
      TE.fromOption(() => err)
    );

  return pipe(
    getDefiLlamaPrice(tokenAddr, network, date),
    // Try fallback address if fetching fails.
    chainLeft((err) =>
      pipe(
        fallback(err),
        log(`Failed to get DefiLlama price for ${tokenAddr}, trying fallback`),
        TE.chain((fb) => getDefiLlamaPrice(fb, network, date))
      )
    ),

    // Fallback to Coingecko in case of failure with original address.
    chainLeft(() => {
      console.log(
        `Failed to get DefiLlama price for ${tokenAddr}'s fallback, trying CoinGecko`
      );

      return getCoinGeckoPrice(tokenAddr, network, "usd", date!);
    }),
    // Try fallback address with coingecko if fetching still fails.
    chainLeft((err) =>
      pipe(
        fallback(err),
        log(`Failed to get CoinGecko price for ${tokenAddr}, trying fallback`),
        TE.chain((fb) => getCoinGeckoPrice(fb, network, "usd", date!))
      )
    ),
    // Last ditch effort to look at manual price fallback values and / or logic.
    chainLeft((err) =>
      pipe(
        TO.fromNullable(tokenSymbol),
        TO.chain((a) => fallbackManual(a)),
        TE.fromTaskOption(
          () =>
            new Error(
              `Could not find fallback dollar value for ${tokenAddr}\n" + ${err.stack}`
            )
        )
      )
    )
  );
}
