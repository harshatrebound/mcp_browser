import { ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { McpClient, Options, Status } from "./mcpClient";

interface UseMcpClientOptions
  extends Omit<Options, "onProgress" | "onStatusChange"> {
  autoConnect?: boolean;
}

export function useMcpClient(options: UseMcpClientOptions) {
  const clientRef = useRef<McpClient | null>(null);
  const [status, setStatus] = useState<Status>("disconnected");
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);

  // Initialize client
  useEffect(() => {
    clientRef.current = new McpClient({
      ...options,
      onStatusChange: setStatus,
      onProgress: console.log,
    });

    // Auto-connect if enabled
    if (options.autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (clientRef.current && status === "connected") {
        clientRef.current.disconnect().catch(console.error);
      }
    };
  }, [options, status]);

  // Connect to server
  const connect = useCallback(async () => {
    if (!clientRef.current) return;
    try {
      await clientRef.current.connect();
    } catch (error) {
      console.error("Failed to connect:", error);
    }
  }, []);

  // Disconnect from server
  const disconnect = useCallback(async () => {
    if (!clientRef.current) return;
    try {
      await clientRef.current.disconnect();
    } catch (error) {
      console.error("Failed to disconnect:", error);
    }
  }, []);

  return {
    notifications,
    connect,
    disconnect,
    status,
    clearNotifications: () => setNotifications([]),
  };
}
