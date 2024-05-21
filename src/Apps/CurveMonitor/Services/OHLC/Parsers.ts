import type * as ApiTypes from "@CM/Services/OHLC/ApiTypes";
import type * as Models from "@CM/Services/OHLC/Models";

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
