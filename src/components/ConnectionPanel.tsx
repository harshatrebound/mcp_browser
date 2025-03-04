import { Status } from "../lib/mcpClient";
import { cn } from "../lib/utils";

interface ConnectionPanelProps {
  serverUrl: string;
  onServerUrlChange: (url: string) => void;
  connectionStatus: Status;
  onConnect: () => void;
  onDisconnect: () => void;
}

export function ConnectionPanel({
  serverUrl,
  onServerUrlChange,
  connectionStatus,
  onConnect,
  onDisconnect,
}: ConnectionPanelProps) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Connection Settings</h2>

      <div className="mb-4">
        <label htmlFor="serverUrl" className="block mb-2 font-medium">
          Server URL
        </label>
        <input
          id="serverUrl"
          type="text"
          value={serverUrl}
          onChange={(e) => onServerUrlChange(e.target.value)}
          className="w-full p-2 border rounded bg-background border-input"
          placeholder="https://your-mcp-server.com/sse"
        />
      </div>

      <div className="flex items-center justify-between">
        <div>
          Status:
          <span
            className={cn("ml-2 font-bold", {
              "text-green-600": connectionStatus === "connected",
              "text-red-600": connectionStatus === "error",
              "text-muted-foreground": connectionStatus === "disconnected",
            })}
          >
            {connectionStatus.charAt(0).toUpperCase() +
              connectionStatus.slice(1)}
          </span>
        </div>

        <div className="space-x-2">
          <button
            onClick={onConnect}
            disabled={connectionStatus === "connected"}
            className={cn(
              "px-4 py-2 rounded transition-colors",
              connectionStatus === "connected"
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-primary text-primary-foreground hover:bg-primary/90",
            )}
          >
            Connect
          </button>

          <button
            onClick={onDisconnect}
            disabled={connectionStatus !== "connected"}
            className={cn(
              "px-4 py-2 rounded transition-colors",
              connectionStatus !== "connected"
                ? "bg-muted text-muted-foreground cursor-not-allowed"
                : "bg-destructive text-white",
            )}
          >
            Disconnect
          </button>
        </div>
      </div>
    </div>
  );
}
