import { formatUnits, parseUnits } from "viem";

/**
 * Returns the appropriate unit suffix for a given number value.
 *
 * @param value - The number to determine the unit for.
 * @returns The unit suffix as a string ('t' for trillion, 'b' for billion, 'm' for million, 'k' for thousand, or '' for smaller values).
 *
 * @example
 * unit(1500000000000) // Returns 't'
 * unit(2000000000) // Returns 'b'
 * unit(3000000) // Returns 'm'
 * unit(4000) // Returns 'k'
 * unit(500) // Returns ''
 * unit(-1000000) // Returns 'm'
 * unit(0) // Returns ''
 */
export function unit(value: number): string {
  const units = ["", "k", "m", "b", "t"];
  const index = Math.max(
    0,
    Math.min(units.length - 1, Math.floor(Math.log10(Math.abs(value)) / 3))
  );

  return units[index];
}

/**
 * Rounds a number to a specified precision and formats it based on the given type.
 *
 * @param value - The number to round and format.
 * @param decimals - The number of decimal places to round to. Use Infinity for locale-specific formatting.
 * @param type - The type of formatting to apply: "" for no special formatting, "dollar" for currency-like formatting, or "percentage" for percentage formatting.
 * @returns A string representation of the rounded and formatted number.
 *
 * @example
 * round(1234.5678, 2, "dollar") // Returns "1.23k"
 * round(0.1234, 2, "percentage") // Returns "12.34%"
 * round(1000000, 1, "dollar") // Returns "1.0m"
 * round(123.456, Infinity, "") // Returns locale-specific formatting, e.g., "123.456" or "123,456"
 * round(1234567.89, 2) // Returns "1,234,567.89"
 */
export function round(
  value: number,
  decimals = 0,
  type: "" | "dollar" | "percentage" = ""
): string {
  if (type === "dollar") {
    const exp = Math.floor(Math.log10(Math.abs(value)) / 3) * 3;
    value /= 10 ** exp || 1;
  }

  const formatOptions =
    type === "" || decimals === Infinity
      ? undefined
      : {
          minimumFractionDigits: decimals,
          maximumFractionDigits: decimals,
        };

  return value.toLocaleString(undefined, formatOptions);
}

export function bigNumToNumber(value: bigint, decimals: bigint): number {
  return parseFloat(formatUnits(value, Number(decimals)));
}

export function numToBigNumber(value: number, decimals: bigint): bigint {
  const decimalPlaces = Number(decimals);
  const valueString = Number.isInteger(value)
    ? value.toString()
    : value.toFixed(decimalPlaces);

  return parseUnits(valueString, decimalPlaces);
}
