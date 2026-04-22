import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import fetch from "node-fetch";

const WP_BASE_URL = process.env.WP_BASE_URL || "http://wpfunnels.local";
const WP_USER = process.env.WP_USER || "";
const WP_APP_PASSWORD = process.env.WP_APP_PASSWORD || "";
const API_BASE = `${WP_BASE_URL}/wp-json/gutenberg-mcp/v1`;

function authHeader() {
  const credentials = Buffer.from(`${WP_USER}:${WP_APP_PASSWORD}`).toString("base64");
  return { Authorization: `Basic ${credentials}`, "Content-Type": "application/json" };
}

async function wpRequest(method, path, body) {
  const url = `${API_BASE}${path}`;
  const res = await fetch(url, {
    method,
    headers: authHeader(),
    body: body ? JSON.stringify(body) : undefined,
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.error || data.message || `HTTP ${res.status}`);
  }
  return data;
}

const TOOLS = [
  {
    name: "list_pages",
    description: "List all WordPress pages with their block count and metadata",
    inputSchema: {
      type: "object",
      properties: {
        per_page: { type: "number", description: "Results per page (default 50)" },
        page: { type: "number", description: "Page number (default 1)" },
        search: { type: "string", description: "Search term to filter pages" },
      },
    },
  },
  {
    name: "get_page",
    description: "Get a WordPress page by ID, including all parsed Gutenberg blocks",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Page ID" },
      },
      required: ["id"],
    },
  },
  {
    name: "create_page",
    description: "Create a new WordPress page with Gutenberg blocks",
    inputSchema: {
      type: "object",
      properties: {
        title: { type: "string", description: "Page title" },
        status: {
          type: "string",
          enum: ["draft", "publish", "pending", "private"],
          description: "Page status (default: draft)",
        },
        blocks: {
          type: "array",
          description: "Array of Gutenberg block descriptors",
          items: {
            type: "object",
            properties: {
              blockName: { type: "string", description: "Block name e.g. core/paragraph, core/heading, core/image" },
              attrs: { type: "object", description: "Block attributes e.g. {level: 2} for headings" },
              innerContent: { type: "string", description: "HTML content inside the block" },
            },
            required: ["blockName"],
          },
        },
      },
      required: ["title"],
    },
  },
  {
    name: "update_page",
    description: "Update an existing WordPress page — change title, status, or replace blocks",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Page ID to update" },
        title: { type: "string", description: "New page title" },
        status: {
          type: "string",
          enum: ["draft", "publish", "pending", "private", "trash"],
          description: "New page status",
        },
        blocks: {
          type: "array",
          description: "Replacement blocks (replaces all existing blocks)",
          items: {
            type: "object",
            properties: {
              blockName: { type: "string" },
              attrs: { type: "object" },
              innerContent: { type: "string" },
            },
            required: ["blockName"],
          },
        },
      },
      required: ["id"],
    },
  },
  {
    name: "delete_page",
    description: "Delete or trash a WordPress page",
    inputSchema: {
      type: "object",
      properties: {
        id: { type: "number", description: "Page ID to delete" },
        force: { type: "boolean", description: "Permanently delete (true) or move to trash (false, default)" },
      },
      required: ["id"],
    },
  },
  {
    name: "list_block_types",
    description: "List all registered Gutenberg block types available on the WordPress site",
    inputSchema: { type: "object", properties: {} },
  },
  {
    name: "render_blocks",
    description: "Render Gutenberg blocks to HTML — useful for previewing content before saving",
    inputSchema: {
      type: "object",
      properties: {
        blocks: {
          type: "array",
          description: "Array of block descriptors to render",
          items: {
            type: "object",
            properties: {
              blockName: { type: "string" },
              attrs: { type: "object" },
              innerContent: { type: "string" },
            },
            required: ["blockName"],
          },
        },
      },
      required: ["blocks"],
    },
  },
];

const server = new Server(
  { name: "gutenberg-mcp-server", version: "1.0.0" },
  { capabilities: { tools: {} } }
);

server.setRequestHandler(ListToolsRequestSchema, async () => ({ tools: TOOLS }));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  try {
    let result;

    switch (name) {
      case "list_pages": {
        const params = new URLSearchParams();
        if (args.per_page) params.set("per_page", args.per_page);
        if (args.page) params.set("page", args.page);
        if (args.search) params.set("search", args.search);
        const qs = params.toString() ? `?${params}` : "";
        result = await wpRequest("GET", `/pages${qs}`);
        break;
      }
      case "get_page":
        result = await wpRequest("GET", `/pages/${args.id}`);
        break;
      case "create_page":
        result = await wpRequest("POST", "/pages", args);
        break;
      case "update_page": {
        const { id, ...body } = args;
        result = await wpRequest("PUT", `/pages/${id}`, body);
        break;
      }
      case "delete_page":
        result = await wpRequest("DELETE", `/pages/${args.id}?force=${!!args.force}`);
        break;
      case "list_block_types":
        result = await wpRequest("GET", "/block-types");
        break;
      case "render_blocks":
        result = await wpRequest("POST", "/render-blocks", args);
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }

    return {
      content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
    };
  } catch (err) {
    return {
      content: [{ type: "text", text: `Error: ${err.message}` }],
      isError: true,
    };
  }
});

const transport = new StdioServerTransport();
await server.connect(transport);
