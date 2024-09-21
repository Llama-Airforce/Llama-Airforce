import { formatUnits, parseUnits } from "viem";

/**
 * No shame, ripped from
 * https://stackoverflow.com/questions/2901102/how-to-print-a-number-with-commas-as-thousands-separators-in-javascript
 */
export function formatNumber(
  number: number,
  decimals = 0,
  dec_point = ".",
  thousands_sep = ","
): string {
  /*
   * http://kevin.vanzonneveld.net
   * +   original by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
   * +   improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
   * +     bugfix by: Michael White (http://getsprink.com)
   * +     bugfix by: Benjamin Lupton
   * +     bugfix by: Allan Jensen (http://www.winternet.no)
   * +    revised by: Jonas Raoni Soares Silva (http://www.jsfromhell.com)
   * +     bugfix by: Howard Yeend
   * +    revised by: Luke Smith (http://lucassmith.name)
   * +     bugfix by: Diogo Resende
   * +     bugfix by: Rival
   * +      input by: Kheang Hok Chin (http://www.distantia.ca/)
   * +   improved by: davook
   * +   improved by: Brett Zamir (http://brett-zamir.me)
   * +      input by: Jay Klehr
   * +   improved by: Brett Zamir (http://brett-zamir.me)
   * +      input by: Amir Habibi (http://www.residence-mixte.com/)
   * +     bugfix by: Brett Zamir (http://brett-zamir.me)
   * +   improved by: Theriault
   * +   improved by: Drew Noakes
   * *     example 1: number_format(1234.56);
   * *     returns 1: '1,235'
   * *     example 2: number_format(1234.56, 2, ',', ' ');
   * *     returns 2: '1 234,56'
   * *     example 3: number_format(1234.5678, 2, '.', '');
   * *     returns 3: '1234.57'
   * *     example 4: number_format(67, 2, ',', '.');
   * *     returns 4: '67,00'
   * *     example 5: number_format(1000);
   * *     returns 5: '1,000'
   * *     example 6: number_format(67.311, 2);
   * *     returns 6: '67.31'
   * *     example 7: number_format(1000.55, 1);
   * *     returns 7: '1,000.6'
   * *     example 8: number_format(67000, 5, ',', '.');
   * *     returns 8: '67.000,00000'
   * *     example 9: number_format(0.9, 0);
   * *     returns 9: '1'
   * *    example 10: number_format('1.20', 2);
   * *    returns 10: '1.20'
   * *    example 11: number_format('1.20', 4);
   * *    returns 11: '1.2000'
   * *    example 12: number_format('1.2000', 3);
   * *    returns 12: '1.200'
   */
  const n = !isFinite(+number) ? 0 : +number,
    prec = !isFinite(+decimals) ? 0 : Math.abs(decimals),
    sep = typeof thousands_sep === "undefined" ? "," : thousands_sep,
    dec = typeof dec_point === "undefined" ? "." : dec_point,
    toFixedFix = function (n: number, prec: number) {
      // Fix for IE parseFloat(0.55).toFixed(0) = 0;
      const k = Math.pow(10, prec);
      return Math.round(n * k) / k;
    },
    s = (prec ? toFixedFix(n, prec) : Math.round(n)).toString().split(".");
  if (s[0].length > 3) {
    s[0] = s[0].replace(/\B(?=(?:\d{3})+(?!\d))/g, sep);
  }
  if ((s[1] || "").length < prec) {
    s[1] = s[1] || "";
    s[1] += new Array(prec - s[1].length + 1).join("0");
  }
  return s.join(dec);
}

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
 */
export function unit(value: number): string {
  const valueAbs = Math.abs(value);

  if (valueAbs >= 1 * 10 ** 12) {
    return "t";
  } else if (valueAbs >= 1 * 10 ** 9) {
    return "b";
  } else if (valueAbs >= 1 * 10 ** 6) {
    return "m";
  } else if (valueAbs >= 1 * 10 ** 3) {
    return "k";
  } else {
    return "";
  }
}

/**
 * Rounds a number to a specified precision and formats it based on the given type.
 *
 * @param value - The number to round and format.
 * @param precision - The number of decimal places to round to. Use Infinity for locale-specific formatting.
 * @param type - The type of formatting to apply: "" for no special formatting, "dollar" for currency-like formatting, or "percentage" for percentage formatting.
 * @returns A string representation of the rounded and formatted number.
 *
 * @example
 * round(1234.5678, 2, "dollar") // Returns "1.23k"
 * round(0.1234, 2, "percentage") // Returns "12.34"
 * round(1000000, 1, "dollar") // Returns "1.0m"
 * round(123.456, Infinity, "") // Returns locale-specific formatting, e.g., "123.456" or "123,456"
 */
export function round(
  value: number,
  precision: number,
  type: "" | "dollar" | "percentage"
): string {
  const valueAbs = Math.abs(value);

  if (precision === Infinity) {
    return value.toLocaleString();
  }

  if (type === "percentage") {
    return formatNumber(value, precision);
  } else if (type === "dollar") {
    if (valueAbs >= 1 * 10 ** 12) {
      return formatNumber(value / 10 ** 12, precision);
    } else if (valueAbs >= 1 * 10 ** 9) {
      return formatNumber(value / 10 ** 9, precision);
    } else if (valueAbs >= 1 * 10 ** 6) {
      return formatNumber(value / 10 ** 6, precision);
    } else if (valueAbs >= 1 * 10 ** 3) {
      return formatNumber(value / 10 ** 3, precision);
    } else {
      return formatNumber(value, precision);
    }
  } else {
    return value.toString();
  }
}

export function roundPhil(value: number): string {
  return Number(value.toFixed(value > 100 ? 0 : 2)).toLocaleString();
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
