# Browser-based MCP Client

A simple browser-based client for the Model Context Protocol (MCP) that connects directly to MCP servers using Server-Sent Events (SSE).

## Overview

This project demonstrates how to connect to an MCP server directly from a browser using the SSE transport, without requiring a proxy server. It provides a simple UI for:

- Connecting to an MCP server
- Viewing server capabilities
- Making requests to the server
- Receiving and displaying notifications

## Project Structure

### 1. Core MCP Client
- **mcpClient.ts**: Implements the core MCP client functionality using the MCP SDK with SSE transport.
- **useMcpClient.ts**: React hook for using the MCP client in React components.

### 2. UI Components
- **ChatMessage.tsx**: For displaying chat messages.
- **ChatPanel.tsx**: For managing chat interactions.
- **SettingsDialog.tsx**: For user settings.
- **ThemeToggle.tsx**: For toggling themes.
- **theme-provider.tsx**: For providing theme context.
- **ui**: Contains additional UI components.

### 3. Main Application
- **App.tsx**: Main application component that integrates all the UI components.
- Uses Tailwind CSS for styling.

## Supported Features
- Direct connection to MCP servers using SSE.
- Authentication via Bearer tokens.
- Viewing server capabilities.
- Making requests to the server.
- Receiving and displaying notifications.

## Features

- Direct connection to MCP servers using SSE
- Support for authentication via Bearer tokens
- View server capabilities
- Make requests to the server (ping, resources, prompts, tools)
- Display server notifications

## Getting Started

### Prerequisites

- Node.js (v18 or later)
- pnpm

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/browser-use-mcp-client.git
   cd browser-use-mcp-client
   ```

2. Install dependencies:
   ```bash
   pnpm install
   ```

3. Start the development server:
   ```bash
   pnpm dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

## Usage

1. Enter the URL of your MCP server in the "Server URL" field (e.g., `http://localhost:3001/sse`)
2. If your server requires authentication, enter your Bearer token in the "Auth Token" field
3. Click "Connect" to establish a connection to the server
4. Once connected, you can:
   - View the server's capabilities
   - Make requests using the "Make Request" panel
   - View notifications from the server in the "Notifications" panel

## Built With

- [React](https://reactjs.org/) - UI framework
- [TypeScript](https://www.typescriptlang.org/) - Type-safe JavaScript
- [Vite](https://vitejs.dev/) - Build tool and development server
- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Model Context Protocol SDK](https://github.com/modelcontextprotocol/sdk) - MCP client library

## License

This project is licensed under the MIT License - see the LICENSE file for details.
