import { type Action } from "@PM/Services/Socket/types";
import { type TroveOverviewSettings } from "@PM/Services/Socket/TroveOverviewService";

type MessageListener = (data: string) => void;
type GenericMessage = {
  channel: string;
  action: Action;
  settings: TroveOverviewSettings;
};
type ParsingStrategy = (message: string) => string;

export class WebSocketConnectionManager {
  private static instances: Record<string, WebSocketConnectionManager> = {};
  private messageQueue: string[] = [];
  private ws: WebSocket | null = null;
  private shouldReconnect = true;
  private listeners: Record<string, Record<string, MessageListener>> = {};
  private channelSubscriptionParsers: Record<string, ParsingStrategy> = {};

  private reconnectDelay = 1000;
  private maxReconnectDelay = 30000;
  private reconnectMultiplier = 2;

  public static getInstance(url: string): WebSocketConnectionManager {
    if (!WebSocketConnectionManager.instances[url]) {
      WebSocketConnectionManager.instances[url] = new WebSocketConnectionManager(url);
    }
    return WebSocketConnectionManager.instances[url];
  }

  private constructor(private url: string) {
    this.connect();
  }

  private connect(): void {
    if (this.ws) return;

    this.ws = new WebSocket(this.url);

    this.ws.onopen = () => {
      this.processMessageQueue();
      this.reconnectDelay = 1000;
    };

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => {
          this.connect();
          this.reconnectDelay *= this.reconnectMultiplier;
          if (this.reconnectDelay > this.maxReconnectDelay) {
            this.reconnectDelay = this.maxReconnectDelay;
          }
        }, this.reconnectDelay);
      }
    };

    this.ws.onmessage = (event: MessageEvent<string>) => {
      const genericMessage = JSON.parse(event.data) as GenericMessage;
      const parser = this.channelSubscriptionParsers[genericMessage.channel];
      const subscription = parser ? parser(event.data) : "";
      const listenerForSubscription = this.listeners[genericMessage.channel]?.[subscription];
      listenerForSubscription?.(event.data);
    };
  }

  public registerListener(channel: string, subscription: string, subParser: ParsingStrategy, callback: MessageListener): void {
    if (!this.listeners[channel]) {
      this.listeners[channel] = {};
    }
    this.listeners[channel][subscription] = callback;
    this.channelSubscriptionParsers[channel] = subParser;
    const messagesForChannel = this.messageQueue.filter(msg => (JSON.parse(msg) as GenericMessage).channel === channel);
    messagesForChannel.forEach(callback);
    this.messageQueue = this.messageQueue.filter(msg => !messagesForChannel.includes(msg));
  }

  public send(message: string): void {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(message);
    } else {
      this.messageQueue.push(message);
    }
  }

  private processMessageQueue(): void {
    while (this.messageQueue.length) {
      this.send(this.messageQueue.shift() ?? '');
    }
  }

  public closeConnection(): void {
    this.shouldReconnect = false;
    this.ws?.close();
  }

  public getConnection(): WebSocket | null {
    return this.ws;
  }
}
