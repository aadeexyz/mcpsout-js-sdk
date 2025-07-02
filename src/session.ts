import { ulid } from "ulidx";

// TODO: Implement session management
export function newSessionId(): string {
    return ulid();
}
