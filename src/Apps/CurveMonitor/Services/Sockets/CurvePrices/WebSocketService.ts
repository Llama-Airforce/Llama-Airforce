import type { LlammaOhlcSettings } from "@CM/Services/Sockets/CurvePrices/LlammaOhlcService";
import { type Action } from "@CM/Services/Sockets/CurvePrices/types";

type MessageListener = (data: string) => void;
type GenericMessage = {
  channel: string;
  action: Action;
  settings: LlammaOhlcSettings; // expand to other settings type if needed
};


export class WebSocketConnectionManager {
  private static instance: WebSocketConnectionManager;
  private messageQueue: string[] = [];
  private ws: WebSocket | null = null;
  private shouldReconnect = true;
  private listeners: Record<string, MessageListener[]> = {};


  public static getInstance(): WebSocketConnectionManager {
    if (!WebSocketConnectionManager.instance) {
      WebSocketConnectionManager.instance = new WebSocketConnectionManager();
    }
    return WebSocketConnectionManager.instance;
  }

  public connect(url: string): void {
    if (this.ws) {
      return;
    }
    this.ws = new WebSocket(url);

    this.ws.onopen = () => {
      this.processMessageQueue();
    };

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(url), 1000);
      }
    };

    this.ws.onmessage = (event: MessageEvent<string>) => {
      try {
        const genericMessage = JSON.parse(event.data) as GenericMessage;
        /*
         * FIXME: TEMPORARY WORKAROUND - NEEDS TO BE FIXED CLIENT SIDE FIRST
         * Removing the feed from channel name for now
         */
        const channel = genericMessage.channel.slice(0, -6);
        if (this.listeners[channel]) {
          for (const listener of this.listeners[channel]) {
            listener(event.data);
          }
        } else {
          this.messageQueue.push(event.data);
        }
      } catch (error) {
        console.error("WSManager error parsing message: ", error);
      }
    };
  }

  public registerListener(channel: string, callback: MessageListener): void {
    if (!this.listeners[channel]) {
      this.listeners[channel] = [];
    }
    this.listeners[channel].push(callback);

    // Process any queued messages for this channel
    const messagesForChannel = this.messageQueue.filter(msg => {
      const genericMessage = JSON.parse(msg) as GenericMessage;
      return genericMessage.channel === channel;
    });
    for (const msg of messagesForChannel) {
      callback(msg);
    }
    this.messageQueue = this.messageQueue.filter(msg => !messagesForChannel.includes(msg));
  }

  public send(message: string): void {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.send(message);
      }
    }
  }

  public closeConnection(): void {
    this.shouldReconnect = false;
    if (this.ws) {
      this.ws.close();
    }
  }

  public getConnection(): WebSocket | null {
    return this.ws;
  }
}
