import { Observable } from "rxjs";
import { type GeneralErc20TokenSpecificBlockSummary } from "./Models";

const mockUSDCBlockSummary: GeneralErc20TokenSpecificBlockSummary = {
  blockNumber: 17000000,
  blockUnixtime: 1686000000,
  transfers: [
    [
      {
        transferFrom: "0x1234567890123456789012345678901234567890",
        transferTo: "0x0987654321098765432109876543210987654321",
        parsedAmount: 1000000,
        coinAddress: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
        coinSymbol: "USDC",
        txHash:
          "0xabcdef1234567890abcdef1234567890abcdef1234567890abcdef1234567890",
        blockNumber: 17000000,
        blockUnixtime: 1686000000,
        positionInBlock: 0,
        gasInGwei: 20,
        contractCaller: "0x2468101214161820222426283032343638404242",
        calledContract: "0x1357911131517192123252729313335373941434",
      },
    ],
  ],
};

export const mockBlockSummaryObservable = () =>
  new Observable<GeneralErc20TokenSpecificBlockSummary>((subscriber) => {
    subscriber.next(mockUSDCBlockSummary);
    subscriber.complete();
  });
