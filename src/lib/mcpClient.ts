import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";
import {
  ProgressNotification,
  ProgressNotificationSchema,
} from "@modelcontextprotocol/sdk/types.js";

export type Status = "connected" | "disconnected" | "error";

export interface Options {
  serverUrl: string;
  proxyUrl?: string;
  authToken?: string;
  onProgress?: (notification: ProgressNotification) => void;
  onStatusChange?: (status: Status) => void;
}

export class McpClient {
  private client: Client | null = null;
  private transport: SSEClientTransport | null = null;
  private connectionStatus: Status = "disconnected";
  private proxyUrl: URL = new URL("http://localhost:3000/sse");

  private options: Options;

  constructor(options: Options) {
    this.options = options;
  }

  public async connect(): Promise<void> {
    try {
      this.client = new Client({
        name: "chrome-use",
        version: "1.0.0",
      });

      this.proxyUrl.searchParams.append("url", this.options.serverUrl);
      this.transport = new SSEClientTransport(this.proxyUrl);
      // Connect to the server
      await this.client.connect(this.transport);
      this.connectionStatus = "connected";

      // Update connection status
      if (this.options.onStatusChange) {
        this.options.onStatusChange("connected");
      }

      // Set notification handler if provided
      if (this.options.onProgress) {
        this.client.setNotificationHandler(
          ProgressNotificationSchema,
          this.options.onProgress,
        );
      }
    } catch (error) {
      console.error("Failed to connect to MCP server:", error);
      this.connectionStatus = "error";
      this.options.onStatusChange?.("error");
      throw error;
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.transport?.close();
      this.connectionStatus = "disconnected";
      this.options.onStatusChange?.("error");
    } catch (error) {
      console.error("Error disconnecting from MCP server:", error);
      throw error;
    }
  }

  public async cancelRequest(requestId: string): Promise<void> {
    this.client?.notification({
      method: "notifications/cancelled",
      params: { requestId },
    });
  }

  public getConnectionStatus(): "connected" | "disconnected" | "error" {
    return this.connectionStatus;
  }
}
