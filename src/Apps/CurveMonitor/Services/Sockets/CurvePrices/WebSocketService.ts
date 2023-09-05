export type WebSocketEventListener = (data: string) => void;

export class WebSocketService {
  private readonly ws: WebSocket;
  private readonly events: { [type: string]: WebSocketEventListener[] } = {};

  constructor(url: string) {
    this.ws = new WebSocket(url);
    this.ws.onmessage = this.handleMessageEvent.bind(this);
    this.ws.onopen = this.handleOpenEvent.bind(this);
    this.ws.onerror = this.handleErrorEvent.bind(this);
    this.ws.onclose = this.handleCloseEvent.bind(this);
  }

  private handleOpenEvent(event: Event) {
    this.dispatch('open', event);
  }

  private handleErrorEvent(event: Event) {
    this.dispatch('error', event);
  }

  private handleCloseEvent(event: CloseEvent) {
    this.dispatch('close', event);
  }

  private handleMessageEvent(event: MessageEvent) {
    const listeners = this.events.message || [];
    for (const listener of listeners) {
      listener(event.data);  // provide raw data to listeners
    }
  }

  private dispatch(type: string, event: Event) {
    const listeners = this.events[type] || [];
    for (const listener of listeners) {
      listener(event);
    }
  }

  public on(type: string, listener: WebSocketEventListener) {
    if (!this.events[type]) {
      this.events[type] = [];
    }
    this.events[type].push(listener);
  }

  public off(type: string, listener: WebSocketEventListener) {
    const listeners = this.events[type] || [];
    const index = listeners.indexOf(listener);
    if (index !== -1) {
      listeners.splice(index, 1);
    }
  }

  public send(data: string) {
    this.ws.send(data);
  }
}
