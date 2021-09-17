if (process.env.NODE_ENV === "production") {
  throw new Error("cors is not configured for production");
}

const corsConfig = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

export default corsConfig;
