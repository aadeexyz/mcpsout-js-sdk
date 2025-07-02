import { NAME } from "./constants";

import type { MCPServerLike } from "./types";

function errorMessage(message: string) {
    return `${NAME} SDK compatibility error: ${message}`;
}

export function checkServerCompatibility(server: any): MCPServerLike {
    if (!server || typeof server !== "object") {
        throw new Error(errorMessage("Server must be an object."));
    }

    let rawServer = server;
    if (server.server && typeof server.server === "object") {
        rawServer = server.server;
    }

    if (
        typeof rawServer._serverInfo !== "object" ||
        !rawServer._serverInfo.name
    ) {
        throw new Error(
            errorMessage(
                "Server must have a '_serverInfo' property of type object."
            )
        );
    }

    if (typeof rawServer.getClientVersion !== "function") {
        throw new Error(
            errorMessage("Server must have a 'getClientVersion' method.")
        );
    }

    if (
        !rawServer._requestHandlers ||
        !(rawServer._requestHandlers instanceof Map)
    ) {
        throw new Error(
            errorMessage(
                "Server must have a '_requestHandlers' property of type Map."
            )
        );
    }

    if (typeof rawServer._requestHandlers.get !== "function") {
        throw new Error(
            errorMessage(
                "Server's '_requestHandlers' Map must have a 'get' method."
            )
        );
    }

    if (typeof rawServer.setRequestHandler !== "function") {
        throw new Error(
            errorMessage("Server must have a 'setRequestHandler' method.")
        );
    }

    return rawServer;
}

export function mcpCompatibleError(error: unknown): string {
    if (error instanceof Error) {
        try {
            return JSON.stringify(error, Object.getOwnPropertyNames(error));
        } catch {
            return error.message || "Unknown error";
        }
    } else if (typeof error === "string") {
        return error;
    } else if (typeof error === "object" && error !== null) {
        try {
            return JSON.stringify(error);
        } catch {
            return "Unknown object error";
        }
    }
    return "Unknown error type";
}
