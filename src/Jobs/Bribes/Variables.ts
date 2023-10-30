export type Variables = {
  dbEndpoint: string;
  dbKey: string;
};

export function fromEnvironment(): Variables {
  const dbEndpoint = process.env.DB_ENDPOINT;
  const dbKey = process.env.DB_KEY;

  if (!dbEndpoint) {
    throw new Error("DB_ENDPOINT not set in .env file.");
  }

  if (!dbKey) {
    throw new Error("DB_KEY not set in .env file");
  }

  return {
    dbEndpoint,
    dbKey,
  };
}
