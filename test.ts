import { Client } from "@modelcontextprotocol/sdk/client/index.js";
import { SSEClientTransport } from "@modelcontextprotocol/sdk/client/sse.js";

// Configure the proxy URL with all required parameters
const proxyUrl = new URL("http://localhost:3000/sse");
proxyUrl.searchParams.append("transportType", "sse");
proxyUrl.searchParams.append("url", "http://localhost:8000/sse");

console.log("Connecting to proxy at:", proxyUrl.toString());

// Create SSE transport with proper error handling
const transport = new SSEClientTransport(proxyUrl);

// Add event listeners for debugging
transport.onerror = (error) => {
  console.error("Transport error:", error);
};

// Create the MCP client
const client = new Client(
  {
    name: "example-client",
    version: "1.0.0"
  },
  {
    capabilities: {
      prompts: {},
      resources: {},
      tools: {}
    }
  }
);

// Connect and test
async function testConnection() {
  try {
    console.log("Connecting client...");
    // Client.connect() will start the transport automatically
    await client.connect(transport);
    console.log("Client connected successfully");
    
    // List tools
    console.log("Listing tools...");
    const tools = await client.listTools();
    console.log("Available tools:", tools);
    
    console.log("Test completed successfully");
  } catch (error) {
    console.error("Connection failed:", error);
  }
}

testConnection();