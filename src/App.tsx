import { useState } from "react";
import { ConnectionPanel } from "./components/ConnectionPanel";
import { NotificationsPanel } from "./components/NotificationsPanel";
import { ThemeToggle } from "./components/ThemeToggle";
import { useMcpClient } from "./lib/useMcpClient";

function App() {
  const [serverUrl, setServerUrl] = useState("http://localhost:8000/sse");

  const { notifications, connect, disconnect, clearNotifications, status } =
    useMcpClient({
      serverUrl,
    });

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="container mx-auto p-4 max-w-5xl">
        <header className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Chrome-Use</h1>
            <p className="text-muted-foreground">MCP client for Browser-use</p>
          </div>
          <ThemeToggle />
        </header>

        <main className="space-y-6">
          <div className="p-6 border rounded-lg shadow-sm">
            <ConnectionPanel
              serverUrl={serverUrl}
              onServerUrlChange={setServerUrl}
              connectionStatus={status}
              onConnect={connect}
              onDisconnect={disconnect}
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-6 border rounded-lg shadow-sm">
              <NotificationsPanel
                notifications={notifications}
                onClear={clearNotifications}
              />
            </div>
          </div>
        </main>

        <footer className="mt-8 pt-4 border-t text-center text-muted-foreground">
          <p>
            Built with the{" "}
            <a
              href="https://github.com/modelcontextprotocol/sdk"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Model Context Protocol SDK
            </a>
          </p>
        </footer>
      </div>
    </div>
  );
}

export default App;
