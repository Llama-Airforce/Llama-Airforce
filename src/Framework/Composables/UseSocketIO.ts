import { io } from "socket.io-client";

/**
 * Vue composable for managing a Socket.IO connection.
 *
 * @param url - The base URL for the Socket.IO server.
 * @returns An object containing:
 *   - socket: The Socket.IO instance.
 *   - connecting: A ref indicating if a connection attempt is in progress.
 *   - isConnected: A ref indicating if the socket is currently connected.
 *   - dispose: A function to clean up the socket connection and event listeners.
 */
export function useSocketIO(url: string) {
  const socket = io(`${url}/main`, {
    autoConnect: false,
    secure: true,
  }).on("error", (error: Error) => {
    console.error("Socket.IO error:", error);
  });

  // Refs for connection state
  const connecting = ref(false);
  const isConnected = ref(false);

  // Event handlers
  function onConnect() {
    connecting.value = false;
    isConnected.value = true;
  }

  function onConnectError(error: Error) {
    console.error("Connection error:", error);
    connecting.value = false;
    isConnected.value = false;
  }

  function onDisconnect() {
    isConnected.value = false;
  }

  // Cleans up event listeners and disconnects the socket.
  function dispose() {
    socket?.off("connect", onConnect);
    socket?.off("connect_error", onConnectError);
    socket?.off("disconnect", onDisconnect);
    socket?.disconnect();
  }

  // Connect on component mount.
  onMounted(() => {
    if (socket.connected || connecting.value) {
      return;
    }

    connecting.value = true;

    socket.on("connect", onConnect);
    socket.on("connect_error", onConnectError);
    socket.on("disconnect", onDisconnect);
    socket.connect();
  });

  return { socket, connecting, isConnected, dispose };
}
