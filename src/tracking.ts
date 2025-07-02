import type { MCPServerLike, MCPTrackingData } from "./types";

const serverTracking = new WeakMap<MCPServerLike, MCPTrackingData>();

export function getServerTrackingData(
    sever: MCPServerLike
): MCPTrackingData | undefined {
    return serverTracking.get(sever);
}

export function setServerTrackingData(
    server: MCPServerLike,
    data: MCPTrackingData
): void {
    serverTracking.set(server, data);
}
