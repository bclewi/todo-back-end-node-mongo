import { Request } from "express";

const logRequest = (req: Request): void => {
  console.log(`${req.method} ${req.url}`);
};

export { logRequest };
