import { checkServerCompatibility } from "./compatibility";
import { newSessionId } from "./session";
import { setServerTrackingData } from "./tracking";
import { setupToolCallTracing } from "./tracing";

import type { MCPServerLike, MCPTrackingData, Session } from "./types";

export class MCPScout {
    publishableKey: string;

    constructor(publishableKey: string) {
        this.publishableKey = publishableKey;
    }

    track(server: any): MCPServerLike {
        try {
            const mcpServer = checkServerCompatibility(server);
            const session: Session = {
                id: newSessionId(),
                clientName: mcpServer.getClientVersion()?.name,
                clientVersion: mcpServer.getClientVersion()?.version,
                start: new Date(),
                lastActivity: new Date(),
            };
            const trackingData: MCPTrackingData = {
                publishableKey: this.publishableKey,
                serverName: mcpServer._serverInfo?.name,
                serverVersion: mcpServer._serverInfo?.version,
            };

            setServerTrackingData(mcpServer, trackingData);
            setupToolCallTracing(mcpServer);

            return mcpServer;
        } catch (error) {
            console.error("MCPScout tracking error:", error);

            return server as MCPServerLike;
        }
    }
}
