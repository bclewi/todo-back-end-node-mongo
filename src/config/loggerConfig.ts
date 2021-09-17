if (process.env.NODE_ENV === "production") {
  throw new Error("logger is not configured for production");
}

const loggerConfig = {
  preset: "dev",
};

export default loggerConfig;
