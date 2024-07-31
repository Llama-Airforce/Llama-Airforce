import { type Socket } from "socket.io-client";

/**
 * Generic service for handling socket.io communications
 * @template TServerToClientEvents - Type for server-to-client events
 * @template TClientToServerEvents - Type for client-to-server events
 * @template TSocket - Type of the socket, defaults to Socket
 */
export default abstract class SocketIOService<
  TServerToClientEvents extends Record<string, (...args: never[]) => unknown>,
  TClientToServerEvents extends Record<string, (...args: never[]) => unknown>,
  TSocket extends Socket = Socket
> {
  /** The socket instance */
  protected readonly socket: Ref<TSocket | null>;

  /**
   * @param socket - Ref containing the socket instance or null
   */
  constructor(socket: Ref<TSocket | null>) {
    this.socket = socket;
  }

  /**
   * Emits an event and listens for a response
   * @template TEmit - Type of the emit event
   * @template TListen - Type of the listen event
   * @param emitEvent - The event to emit
   * @param listenEvent - The event to listen for
   * @param args - Arguments for the emit event
   * @returns Promise that resolves with the response from the server
   */
  protected emitAndListen<
    TEmit extends keyof TClientToServerEvents,
    TListen extends keyof TServerToClientEvents
  >(
    emitEvent: TEmit,
    listenEvent: TListen,
    ...args: Parameters<TClientToServerEvents[TEmit]>
  ): Promise<Parameters<TServerToClientEvents[TListen]>[0]> {
    if (!this.socket.value)
      return Promise.reject(new Error("No socket connection"));

    return new Promise((resolve) => {
      // @ts-expect-error Socket is checked above, but TypeScript can't infer it
      this.socket.value!.once(listenEvent, resolve);
      // @ts-expect-error Socket is checked above, but TypeScript can't infer it
      this.socket.value!.emit(emitEvent, ...args);
    });
  }
}
