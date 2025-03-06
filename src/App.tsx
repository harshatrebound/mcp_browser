import { useMCP } from "@/hooks/useMCP";
import { MonitorSmartphone } from "lucide-react";
import { useState } from "react";
import { ChatPanel } from "./components/ChatPanel";
import { SettingsDialog } from "./components/SettingsDialog";

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:8000/sse");

  const {
    image,
    status,
    pending,
    connect,
    messages,
    sendQuery,
    addMessage,
    disconnect,
    clearMessages,
    cancelRequest,
  } = useMCP({
    serverUrl,
  });

  const handleSendMessage = async (message: string) => {
    addMessage("user", message);
    try {
      await sendQuery(message);
    } catch {
      addMessage("tool", "Error running the agent");
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r flex flex-col h-full">
        <ChatPanel
          messages={messages}
          connectionStatus={status}
          hasActiveRequest={pending}
          onClearChat={clearMessages}
          onCancelRequest={cancelRequest}
          onSendMessage={handleSendMessage}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 hidden md:block">
        {image ? (
          <img
            src={`data:image/png;base64,${image}`}
            alt="Screenshot"
            className="w-full h-full rounded-md shadow-md border-2 border-dashed p-1"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center text-muted-foreground border-2 border-dashed border-muted rounded-lg p-12">
            <MonitorSmartphone className="h-24 w-24 mb-4 opacity-20" />
            <h3 className="text-xl font-medium mb-2">
              No Screenshot Available
            </h3>
            <p className="text-center max-w-md">
              Connect to a Browser-use MCP server and make a request to see a
              screenshot of the browser.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-sm">
              <div className="size-3 rounded-full bg-green-500 animate-pulse"></div>
              <span>Screenshots will appear here when available</span>
            </div>
          </div>
        )}
      </div>

      {/* Settings Dialog */}
      <SettingsDialog
        onConnect={connect}
        serverUrl={serverUrl}
        isOpen={isSettingsOpen}
        connectionStatus={status}
        onDisconnect={disconnect}
        onServerUrlChange={setServerUrl}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
}

export default App;
