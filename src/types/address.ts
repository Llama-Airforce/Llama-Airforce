/*
 * Sick and tired of linting and typing errors.
 * I don't know why, but a lot of times the Address type from viem
 * is resolved as simply 'string'. It happens randomly and I
 * have been unable to reproduce this bug. Fuck it.
 */
export type Address = `0x${string}`;
