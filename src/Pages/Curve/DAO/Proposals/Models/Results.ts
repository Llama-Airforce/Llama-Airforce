export type Choice = {
  label: string;
  amount: number;
};

export type Results = {
  token: string;
  choices: Choice[];
};
