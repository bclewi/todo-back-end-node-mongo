const developmentOptions = {
  origin: "*",
  optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
};

let corsConfig = {};
if (process.env.NODE_ENV === "development") {
  corsConfig = developmentOptions;
} else if (process.env.NODE_ENV === "production") {
  throw new Error("cors is not configured for production");
}

export default corsConfig;
