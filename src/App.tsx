import { MonitorSmartphone } from "lucide-react";
import { useEffect, useState } from "react";
import { ChatMessageProps, MessageRole } from "./components/ChatMessage";
import { ChatPanel } from "./components/ChatPanel";
import { SettingsDialog } from "./components/SettingsDialog";
import { useMCP } from "./lib/useMCP";
import { formatLog, StepResult } from "./lib/utils";

const initMessage = {
  role: "tool" as MessageRole,
  content: "Welcome. Connect to a Browser-use MCP server to get started.",
  timestamp: new Date(),
};

type NotifData = {
  screenshot: string;
  result: StepResult;
};

function App() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [serverUrl, setServerUrl] = useState("http://localhost:8000/sse");
  const [messages, setMessages] = useState<ChatMessageProps[]>([initMessage]);
  const [image, setImage] = useState<string | undefined>();
  const [processingIndex, setProcessingIndex] = useState<number | null>(null);

  const {
    notifications,
    connect,
    disconnect,
    status,
    sendQuery,
    cancelRequest,
    hasActiveRequest,
  } = useMCP({
    serverUrl,
  });

  useEffect(() => {
    if (!notifications.length) return;
    const latest = notifications[notifications.length - 1];

    if (latest.method === "notifications/message" && hasActiveRequest) {
      const { screenshot, result } = latest.params.data as NotifData;
      const { eval: out, goal } = formatLog(result as StepResult);
      
      // Update the processing message instead of replacing it
      if (processingIndex !== null) {
        setMessages((prev) => {
          const newMessages = [...prev];
          newMessages[processingIndex] = {
            role: "tool",
            content: `${out}\n${goal}`,
            timestamp: new Date()
          };
          return newMessages;
        });
      }
      
      setImage(screenshot);
    }
  }, [notifications, hasActiveRequest, processingIndex]);

  const addMessage = (role: MessageRole, content: string) => {
    setMessages((prev) => [
      ...prev,
      {
        role,
        content,
        timestamp: new Date(),
      },
    ]);
  };

  const handleSendMessage = async (message: string) => {
    addMessage("user", message);
    addMessage("tool", "Processing Request ...");
    setProcessingIndex(messages.length + 1);
    try {
      const response = await sendQuery(message);
      addMessage("tool", response?.content[0].text as string);
    } catch (error) {
      addMessage(
        "tool",
        `Error: ${error instanceof Error ? error.message : String(error)}`,
      );
    }
    finally{
      setProcessingIndex(null);
    }
  };

  return (
    <div className="flex h-screen bg-background text-foreground">
      {/* Sidebar */}
      <div className="w-full md:w-96 border-r flex flex-col h-full">
        <ChatPanel
          messages={messages}
          onSendMessage={handleSendMessage}
          onCancelRequest={cancelRequest}
          onClearChat={() => {
            setMessages([initMessage]);
            setProcessingIndex(null);
          }}
          connectionStatus={status}
          onOpenSettings={() => setIsSettingsOpen(true)}
          hasActiveRequest={hasActiveRequest}
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
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        serverUrl={serverUrl}
        onServerUrlChange={setServerUrl}
        connectionStatus={status}
        onConnect={connect}
        onDisconnect={disconnect}
      />
    </div>
  );
}

export default App;
