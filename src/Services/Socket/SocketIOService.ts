import { type Socket } from "socket.io-client";
import { Observable, share, type Subscriber } from "rxjs";

/**
 * Represents a map of socket event names to their corresponding event handler functions
 * @example
 * type MyEventMap = {
 *   'userConnected': (userId: string) => void;
 *   'messageReceived': (message: { id: string, text: string }) => void;
 *   'roomJoined': (roomId: string, userCount: number) => void;
 * };
 */
type EventMap = Record<string, (...args: never[]) => unknown>;

/**
 * Extracts the type of the first parameter of a socket event handler function
 * @template TEvents - The event map containing event handlers
 * @template TEvent - The specific event key in the event map
 * @example
 * type MyEvents = {
 *   'userJoined': (user: { id: string, name: string }) => void;
 *   'messageSent': (message: string) => void;
 * };
 * type UserJoinedType = ObserverType<MyEvents, 'userJoined'>; // { id: string, name: string }
 * type MessageSentType = ObserverType<MyEvents, 'messageSent'>; // string
 */
type DataTypeT<
  TEvents extends EventMap,
  TEvent extends keyof TEvents
> = Parameters<TEvents[TEvent]>[0];

/**
 * Represents an Observable for a specific socket event
 * @template TEvents - The event map containing event handlers
 * @template TEvent - The specific event key in the event map
 * @example
 * type MyEvents = {
 *   'userConnected': (userId: string) => void;
 *   'messageReceived': (message: { id: string, text: string }) => void;
 * };
 * type UserConnectedObservable = SocketObservableT<MyEvents, 'userConnected'>; // Observable<string>
 * type MessageReceivedObservable = SocketObservableT<MyEvents, 'messageReceived'>; // Observable<{ id: string, text: string }>
 */
export type SocketObservableT<
  TEvents extends EventMap,
  TEvent extends keyof TEvents
> = Observable<DataTypeT<TEvents, TEvent>>;

/**
 * Generic service for handling socket.io communications
 * @template TSocket - Type of the socket, defaults to Socket
 * @template TServerToClientEvents - Type for server-to-client events, inferred from TSocket
 * @template TClientToServerEvents - Type for client-to-server events, inferred from TSocket
 *
 * @example
 * // Define your event types
 * interface ServerToClientEvents {
 *   userConnected: (userId: string) => void;
 *   messageReceived: (message: { id: string; text: string }) => void;
 * }
 *
 * interface ClientToServerEvents {
 *   sendMessage: (message: string) => void;
 * }
 *
 * // Create a custom socket type
 * type MySocket = Socket<ServerToClientEvents, ClientToServerEvents>;
 *
 * // Extend SocketIOService with your custom socket
 * class MySocketService extends SocketIOService<MySocket> {
 *   // Implement your service methods here
 * }
 */
export default abstract class SocketIOService<
  TSocket extends Socket = Socket,
  TServerToClientEvents extends EventMap = TSocket extends Socket<
    infer S,
    never
  >
    ? S
    : never,
  TClientToServerEvents extends EventMap = TSocket extends Socket<
    never,
    infer C
  >
    ? C
    : never
> {
  /** The socket instance */
  protected readonly socket: TSocket;

  /**
   * Creates an instance of SocketIOService
   * @param socket - The socket instance
   */
  constructor(socket: TSocket) {
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
    if (!this.socket) return Promise.reject(new Error("No socket connection"));

    return new Promise((resolve) => {
      // @ts-expect-error Socket is checked above, but TypeScript can't infer it
      this.socket.once(listenEvent, resolve);
      // @ts-expect-error Socket is checked above, but TypeScript can't infer it
      this.socket.emit(emitEvent, ...args);
    });
  }

  /**
   * Creates an Observable for a specific socket event with optional custom data handling
   * @template TEvent - The event key in the ServerToClientEvents
   * @param event - The event name to listen for
   * @param onData - Optional callback for custom data handling before emitting
   * @returns An Observable that emits the data received from the event
   * @example
   * // Basic usage
   * const userConnected$ = this.createObservable('userConnected');
   * userConnected$.subscribe(user => console.log('User connected:', user));
   *
   * // With custom data handling
   * const chatMessage$ = this.createObservable('chatMessage', (data, subscriber) => {
   *   if (data.isValid) {
   *     subscriber.next(data);
   *   }
   * });
   * chatMessage$.subscribe(message => console.log('New message:', message));
   */
  protected createObservable<TEvent extends keyof TServerToClientEvents>(
    event: TEvent & string,
    onData?: (
      data: DataTypeT<TServerToClientEvents, TEvent>,
      subscriber: Subscriber<DataTypeT<TServerToClientEvents, TEvent>>
    ) => void
  ): SocketObservableT<TServerToClientEvents, TEvent> {
    // Short-hand notation for specific generic types.
    type DataType = DataTypeT<TServerToClientEvents, TEvent>;

    return new Observable<DataType>((subscriber) => {
      if (!this.socket) throw new Error("No socket connection");

      const handler = (
        onData
          ? (data: DataType) => onData(data, subscriber)
          : (data: DataType) => subscriber.next(data)
      ) as DataType;

      this.socket.on(event, handler);

      return () => this.socket.off(event, handler);
    }).pipe(share());
  }
}
