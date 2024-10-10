import type * as ApiTypes from "./ApiTypes";
import type * as Models from "./Models";

export const parseOHLC = (
  x: ApiTypes.GetOHLCResponse["data"][number]
): Models.OHLC => {
  return {
    time: x.time,
    open: x.open,
    high: x.high,
    low: x.low,
    close: x.close,
  };
};
