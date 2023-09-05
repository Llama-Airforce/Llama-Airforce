export class WebSocketConnectionManager {
  private static instance: WebSocketConnectionManager;
  private ws: WebSocket | null = null;
  private shouldReconnect = true;


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

    this.ws.onclose = () => {
      if (this.shouldReconnect) {
        setTimeout(() => this.connect(url), 1000);
      }
    };
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
