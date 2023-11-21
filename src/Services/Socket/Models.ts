export type Action = "subscribe" | "unsubscribe" | "snapshots";
export type PayloadType = "update" | "snapshot";

type GenericMessage = {
  channel: string;
  action: Action;
};

export type Payload<T, Settings> = {
  channel: string;
  subscription: Settings;
  type: PayloadType;
  payload: T[];
};

export type Request<Settings, Channels> = GenericMessage & {
  channel: Channels;
  settings: Settings[];
};
