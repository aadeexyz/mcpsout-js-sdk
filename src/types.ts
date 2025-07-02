export type CompatibleRequestHandlerExtra = {
    sessionId?: string;
    headers?: Record<string, string | string[]>;
    [key: string]: any;
};

export type ServerClientInfoLike = {
    name?: string;
    version?: string;
};

export type MCPServerLike = {
    setRequestHandler(
        schema: any,
        handler: (
            request: any,
            extra?: CompatibleRequestHandlerExtra
        ) => Promise<any>
    ): void;
    _requestHandlers: Map<
        string,
        (request: any, extra?: CompatibleRequestHandlerExtra) => Promise<any>
    >;
    _serverInfo?: ServerClientInfoLike;
    getClientVersion(): ServerClientInfoLike | undefined;
};

export type Session = {
    id: string;
    start: Date;
    lastActivity: Date;
    clientName?: string;
    clientVersion?: string;
};

export type MCPTrackingData = {
    publishableKey: string;
    serverName?: string;
    serverVersion?: string;
};

export type Event = {
    trackingData: MCPTrackingData;
    session?: Session;
    id: string;
    toolName?: string;
    timestamp?: Date;
    duration?: number;
    isError?: boolean;
    error?: string;
    intent?: string;
    request?: object;
    response?: object;
    extra?: CompatibleRequestHandlerExtra;
};
