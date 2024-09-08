export * from "./ArrayHelper";
export * from "./DataPoint";
export * from "./DateHelper";
export * from "./NumberHelper";
export * from "./ObjectHelper";
export * from "./PaginationHelper";
export * from "./PromiseHelper";
export * from "./RouterHelper";
export * from "./StringHelper";
export * from "./Types";
export * from "./PriceHelper";
export * from "./ApyHelper";

/** Used to generate unique IDs. */
const idCounter: Record<string, number> = {};

/**
 * Generates a unique ID. If `prefix` is given, the ID is appended to it.
 *
 * @since 0.1.0
 * @category Util
 * @param {string} [prefix=''] The value to prefix the ID with.
 * @returns {string} Returns the unique ID.
 * @see random
 * @example
 *
 * uniqueId('contact_')
 * // => 'contact_104'
 *
 * uniqueId()
 * // => '105'
 */
export function uniqueId(prefix = "$llama$") {
  if (!idCounter[prefix]) {
    idCounter[prefix] = 0;
  }

  const id = ++idCounter[prefix];
  if (prefix === "$llama$") {
    return `${id}`;
  }

  return `${prefix}${id}`;
}
