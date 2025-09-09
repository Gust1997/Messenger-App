import "dotenv/config";
import express from "express";
import cors from "cors";
import { createExpressMiddleware } from "@trpc/server/adapters/express";
import { appRouter } from "./routers";
import { createContext } from "./context";
import { applyWSSHandler } from "@trpc/server/adapters/ws";
import { WebSocketServer } from "ws";


const app = express();

app.use(cors({origin: "http://localhost:5173"}));

app.use("/trpc", createExpressMiddleware({router: appRouter, createContext}));

const server = app.listen(4000, () => console.log("Hello Server"));

const wss = new WebSocketServer({ server });

applyWSSHandler({
  wss,
  router: appRouter,
  createContext,
});
