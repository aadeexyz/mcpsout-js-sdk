import { AsyncRedactor } from "redact-pii-light";

const redactor = new AsyncRedactor();

export async function deepRedact<T>(data: T): Promise<T> {
    if (typeof data === "string") {
        return (await redactor.redactAsync(data)) as T;
    }

    if (Array.isArray(data)) {
        const out = await Promise.all(data.map((item) => deepRedact(item)));
        return out as T;
    }

    if (data !== null && typeof data === "object") {
        const entries = await Promise.all(
            Object.entries(data).map(
                async ([key, value]) => [key, await deepRedact(value)] as const
            )
        );
        return Object.fromEntries(entries) as T;
    }

    return data;
}
