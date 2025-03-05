import { ServerNotification } from "@modelcontextprotocol/sdk/types.js";
import { useCallback, useEffect, useRef, useState } from "react";
import { McpClient, Options, Status } from "./client";

interface UseMcpClientOptions
  extends Omit<Options, "onProgress" | "onStatusChange"> {
  autoConnect?: boolean;
}

export function useMCP(options: UseMcpClientOptions) {
  const clientRef = useRef<McpClient | null>(null);
  const signalRef = useRef<AbortController | null>(null);

  const [status, setStatus] = useState<Status>("disconnected");
  const [notifications, setNotifications] = useState<ServerNotification[]>([]);
  const [pending, setPending] = useState(false);

  // Initialize client
  useEffect(() => {
    clientRef.current = new McpClient({
      ...options,
      onStatusChange: setStatus,
      onProgress: (notif) => {
        setNotifications((prev) => [...prev, notif]);
      },
    });

    // Auto-connect if enabled
    if (options.autoConnect) {
      connect();
    }

    // Cleanup on unmount
    return () => {
      if (clientRef.current && status === "connected")
        clientRef.current.disconnect().catch(console.error);

      if (signalRef.current) signalRef.current.abort();
    };
  }, [options.serverUrl]); // Only re-initialize when serverUrl changes

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

  // Send request to server using request with AbortController
  const sendQuery = async (message: string) => {
    if (signalRef.current) signalRef.current.abort();

    // Create a new AbortController
    signalRef.current = new AbortController();
    setPending(true);
    try {
      return await clientRef.current?.callTool(
        "perform_search",
        { task: message },
        signalRef.current.signal,
      );
    } finally {
      setPending(false);
    }
  };

  // Cancel the current request
  const cancelRequest = () => {
    signalRef.current?.abort();
    setPending(false);
  };

  return {
    notifications,
    connect,
    disconnect,
    sendQuery,
    cancelRequest,
    status,
    clearNotifications: () => setNotifications([]),
    hasActiveRequest: pending,
  };
}
