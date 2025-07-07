import {
    CallToolRequestSchema,
    ListToolsRequestSchema,
} from "@modelcontextprotocol/sdk/types.js";
import { deepRedact } from "./redaction";
import { getServerTrackingData } from "./tracking";
import { newEvent } from "./event";
import { mcpCompatibleError } from "./compatibility";
import { publishEvent } from "./event";
import { INTERNAL_INTENT_KEY, NAME } from "./constants";

import type { ListToolsResult } from "@modelcontextprotocol/sdk/types.js";
import type { Event, MCPServerLike } from "./types";
import { addIntentToTools } from "./intent";

function isToolResultError(result: any): boolean {
    return result && typeof result === "object" && result.isError === true;
}

export function setupToolCallTracing(server: MCPServerLike): void {
    try {
        const reqHandlers = server._requestHandlers;

        const toolsListHandler = reqHandlers.get("tools/list");
        const toolsCallHandler = reqHandlers.get("tools/call");

        server.setRequestHandler(ListToolsRequestSchema, async (req, extra) => {
            let tools = [];

            try {
                const res = (await toolsListHandler?.(
                    req,
                    extra
                )) as ListToolsResult;
                tools = res.tools || [];
            } catch (err) {
                throw `This error was not caused by ${NAME} SDK, but by the server's tools/list handler: ${err}`;
            }

            if (tools.length === 0) {
                console.warn(
                    `No tools found in the server's tools/list handler. This may indicate that track was called before registering the tools.`
                );
            }

            tools = addIntentToTools(tools);

            return { tools };
        });

        server.setRequestHandler(CallToolRequestSchema, async (req, extra) => {
            const data = getServerTrackingData(server);
            if (!data) return await toolsCallHandler?.(req, extra);

            const [reqRedacted, extraRedacted] = await Promise.all([
                deepRedact(req),
                deepRedact(extra),
            ]);

            const event: Event = newEvent({
                trackingData: data,
                toolName: req.params?.name,
                request: reqRedacted,
                extra: extraRedacted,
            });

            if (
                req.params?.arguments &&
                typeof req.params.arguments === "object" &&
                INTERNAL_INTENT_KEY in req.params.arguments
            ) {
                event.intent = req.params.arguments[INTERNAL_INTENT_KEY];
                delete reqRedacted.params.arguments[INTERNAL_INTENT_KEY];
                event.request = reqRedacted;
            }

            try {
                if (!toolsCallHandler) {
                    throw new Error(
                        `Tool call handler not found for ${
                            req.params?.name || "unknown"
                        }`
                    );
                }

                const result = await toolsCallHandler(req, extra);

                if (isToolResultError(result)) {
                    event.isError = true;
                    event.error = mcpCompatibleError(result);
                }

                event.response = await deepRedact(result);
                event.duration =
                    (event.timestamp &&
                        new Date().getTime() - event.timestamp.getTime()) ||
                    undefined;
                publishEvent(event);
                return result;
            } catch (err) {
                event.isError = true;
                event.error = mcpCompatibleError(err);
                event.duration =
                    (event.timestamp &&
                        new Date().getTime() - event.timestamp.getTime()) ||
                    undefined;
                publishEvent(event);
                throw err;
            }
        });
    } catch (err) {
        console.error("Failed to setup tool call tracing:", err);
        throw err;
    }
}
