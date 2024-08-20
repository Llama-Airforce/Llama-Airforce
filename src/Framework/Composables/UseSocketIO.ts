import { type ShallowRef } from "vue";
import { io, type Socket } from "socket.io-client";

type SocketOptions = {
  url: string | (() => string);
  connectOnMount?: boolean;
};

/**
 * Vue composable for managing a Socket.IO connection.
 *
 * @param opts - Options for configuring the Socket.IO connection.
 * @returns An object containing:
 *   - getSocket: Function to get or create the Socket.IO instance.
 *   - connecting: Ref indicating if a connection attempt is in progress.
 *   - isConnected: Ref indicating if the socket is currently connected.
 *   - connect: Function to initiate a connection.
 *   - disconnect: Function to close the connection and clean up event listeners.
 */
export function useSocketIO<TSocket extends Socket = Socket>(
  opts: SocketOptions
) {
  const { url: urlSource, connectOnMount = true } = opts;

  const socket: ShallowRef<TSocket | null> = shallowRef(null);
  const url = ref("");

  function createSocket() {
    if (socket.value) {
      disconnect();
    }

    url.value = typeof urlSource === "function" ? urlSource() : urlSource;

    return io(url.value, {
      autoConnect: false,
      secure: true,
      reconnection: false, // Reconnection is giving all kind of problems atm...
    }).on("error", (error: Error) => {
      notify({ text: `Socket.IO error: ${error.message}`, type: "error" });
    }) as TSocket;
  }

  // Refs for connection state
  const connecting = ref(false);
  const isConnected = ref(false);

  // Event handlers
  function onConnect() {
    connecting.value = false;
    isConnected.value = true;
  }

  function onConnectError() {
    notify({ text: `Failed to connect to ${url.value}`, type: "error" });
    connecting.value = false;
  }

  function onDisconnect() {
    socket.value = null;
    isConnected.value = false;
  }

  // Cleans up event listeners and disconnects the socket.
  function disconnect() {
    socket.value?.off("connect", onConnect);
    socket.value?.off("connect_error", onConnectError);
    socket.value?.off("disconnect", onDisconnect);

    socket.value?.disconnect();
    onDisconnect();
  }

  function connect() {
    // Ignore if already connecting.
    if (connecting.value) {
      return;
    }

    // Disconnect and clean up any previous socket.
    if (socket.value) {
      disconnect();
    }

    // Create a new socket to make sure the URL will be up to date.
    socket.value = createSocket();

    socket.value.on("connect", onConnect);
    socket.value.on("connect_error", onConnectError);
    socket.value.on("disconnect", onDisconnect);

    connecting.value = true;
    socket.value.connect();
  }

  // Connect on component mount.
  if (connectOnMount) {
    onMounted(connect);
  }

  return { socket, connecting, isConnected, connect, disconnect, url };
}
