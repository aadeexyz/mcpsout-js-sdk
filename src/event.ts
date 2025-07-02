import { ulid } from "ulidx";
import fetch from 'cross-fetch';
import { INGEST_URL } from "./constants";

import type {
    CompatibleRequestHandlerExtra,
    Event,
    MCPTrackingData,
    Session,
} from "./types";

export function newEventId(): string {
    return ulid();
}

export function newEvent({
    sessionData,
    trackingData,
    toolName,
    timestamp,
    duration,
    isError,
    error,
    intent,
    request,
    extra,
    response,
}: {
    sessionData?: Session;
    trackingData: MCPTrackingData;
    toolName?: string;
    timestamp?: Date;
    duration?: number;
    isError?: boolean;
    error?: string;
    intent?: string;
    request?: object;
    extra?: CompatibleRequestHandlerExtra;
    response?: object;
}): Event {
    return {
        session: sessionData,
        trackingData: trackingData,
        id: newEventId(),
        toolName: toolName ?? undefined,
        timestamp: timestamp ?? new Date(),
        duration: duration ?? 0,
        isError: isError ?? false,
        error: error ?? undefined,
        intent: intent ?? undefined,
        request: request ?? {},
        extra: extra ?? {},
        response: response ?? {},
    };
}

export function publishEvent(event: Event) {
    const body = JSON.stringify(event);
    const headers = {
        "Content-Type": "application/json",
    };

    fetch(INGEST_URL, {
        method: "POST",
        headers: headers,
        body: body,
        keepalive: true,
    }).catch(() => {});
}
