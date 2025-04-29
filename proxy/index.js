#!/usr/bin/env node

import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import { SSEServerTransport } from "@modelcontextprotocol/sdk/server/sse.js";
import cors from "cors";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import mcpProxy from "./mcpProxy.js";

// Determine __dirname equivalent in ES module scope
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
app.use(cors());

// Serve static files from the Vite build output directory (usually 'dist')
// Adjust '../../dist' if your proxy/index.js is nested differently relative to the root
app.use(express.static(path.join(__dirname, '../dist')));

const webAppTransports = [];

const createTransport = async (req) => {
  const url = req.query.url;
  const transport = new SSEClientTransport(new URL(url));

  transport.onerror = (error) => {
    console.error("Transport error:", error);
  };
  await transport.start();
  console.log("Connected to SSE transport");
  return transport;
};

app.get("/sse", async (req, res) => {
  console.log("New SSE connection");
  const toServer = await createTransport(req);
  const toClient = new SSEServerTransport("/message", res);

  mcpProxy({
    transportToClient: toClient,
    transportToServer: toServer,
  });

  webAppTransports.push(toClient);
  await toClient.start();

  console.log("Started web app transport");
});

app.post("/message", async (req, res) => {
  try {
    const sessionId = req.query.sessionId;
    console.log(`Received message for sessionId ${sessionId}`);

    const transport = webAppTransports.find((t) => t.sessionId === sessionId);
    if (!transport) {
      console.error(`Session not found: ${sessionId}`);
      res.status(404).end("Session not found");
      return;
    }
    console.log(`Handling post message for session ${sessionId}`);
    await transport.handlePostMessage(req, res);
    console.log(`Handled post message for session ${sessionId}`);
  } catch (error) {
    console.error("Error in /message route:", error);
    res.status(500).json(error);
  }
});

// Serve index.html for any other requests (SPA routing)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../dist', 'index.html'));
});

const PORT = process.env.PORT || 3000;

try {
  const server = app.listen(PORT);
  server.on("listening", () => {
    const addr = server.address();
    const port = typeof addr === "string" ? addr : addr?.port;
    console.log(`Proxy server listening on port ${port}`);
  });
} catch (error) {
  console.error("Failed to start server:", error);
  process.exit(1);
}
