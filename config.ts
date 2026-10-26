const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Missing env var: ${name}`);
  }
  return value;
};

export const credentials = {
  standardUser: requireEnv("STANDARD_USER"),
  lockedOutUser: requireEnv("LOCKED_OUT_USER"),
  password: requireEnv("PASSWORD"),
};
