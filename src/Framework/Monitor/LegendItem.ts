export type LegendItem<T extends string> = {
  id: T;
  label: string;
  color: string;
  togglable?: boolean;
};
