import type { Socket } from "socket.io-client";
import { type Subscriber, Observable, share } from "rxjs";

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
type SocketObservableT<
  TEvents extends EventMap,
  TEvent extends keyof TEvents
> = Observable<DataTypeT<TEvents, TEvent>>;

/**
 * Emits an event and listens for a response on a socket connection.
 *
 * @template TSocket - The socket type
 * @template TServerToClientEvents - Server to client event map
 * @template TClientToServerEvents - Client to server event map
 * @template TEmit - The event to emit
 * @template TListen - The event to listen for
 * @param socket - The socket instance
 * @param emitEvent - The event to emit
 * @param listenEvent - The event to listen for
 * @param args - Arguments for the emit event
 * @returns A promise that resolves with the response data
 * @example
 * const socket = io('http://localhost:3000');
 * const userData = await emitAndListen(
 *   socket,
 *   'requestUserData',
 *   'userData',
 *   'user123'
 * );
 * console.log('User data:', userData);
 */
export function emitAndListen<
  TSocket extends Socket,
  TEmit extends keyof TClientToServerEvents,
  TListen extends keyof TServerToClientEvents,
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
>(
  socket: TSocket,
  emitEvent: TEmit & string,
  listenEvent: TListen,
  ...args: Parameters<TClientToServerEvents[TEmit]>
): Promise<Parameters<TServerToClientEvents[TListen]>[0]> {
  return new Promise((resolve) => {
    socket.once(listenEvent as string, resolve);
    socket.emit(emitEvent, ...args);
  });
}

/**
 * Creates an Observable for a specific socket event with optional custom data handling
 *
 * @template TServerToClientEvents - Server to client event map
 * @template TEvent - The event key in the ServerToClientEvents
 * @param socket - The socket instance
 * @param event - The event name to listen for
 * @param onData - Optional callback for custom data handling before emitting
 * @returns An Observable that emits the data received from the event
 * @example
 * // Basic usage
 * const socket = io('http://localhost:3000');
 * const userConnected$ = createObservable(socket, 'userConnected');
 * userConnected$.subscribe(user => console.log('User connected:', user));
 *
 * // With custom data handling
 * const chatMessage$ = createObservable(socket, 'chatMessage', (data, subscriber) => {
 *   if (data.isValid) {
 *     subscriber.next(data);
 *   }
 * });
 * chatMessage$.subscribe(message => console.log('New message:', message));
 */
export function createObservable<
  TServerToClientEvents extends EventMap,
  TEvent extends keyof TServerToClientEvents
>(
  socket: Socket<TServerToClientEvents>,
  event: TEvent & string,
  onData?: (
    data: DataTypeT<TServerToClientEvents, TEvent>,
    subscriber: Subscriber<DataTypeT<TServerToClientEvents, TEvent>>
  ) => void
): SocketObservableT<TServerToClientEvents, TEvent> {
  // Short-hand notation for specific generic types.
  type EventData = DataTypeT<TServerToClientEvents, TEvent>;

  return new Observable<EventData>((subscriber) => {
    const handler = (
      onData
        ? (data: EventData) => {
            onData(data, subscriber);
          }
        : (data: EventData) => {
            subscriber.next(data);
          }
    ) as EventData;

    socket.on(event, handler);

    return () => socket.off(event, handler);
  }).pipe(share());
}
