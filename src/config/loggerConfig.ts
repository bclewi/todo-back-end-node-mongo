let preset = "dev";
if (process.env.NODE_ENV === "production") {
  throw new Error("logger is not configured for production");
}

export { preset };
