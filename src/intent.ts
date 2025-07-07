import { INTERNAL_INTENT_KEY, INTENT_WORD_LIMIT } from "./constants";

export function addIntentToTools(tools: any[]): any[] {
    return tools.map((tool) => {
        tool.inputSchema ??= {};
        tool.inputSchema.type ??= "object";
        tool.inputSchema.properties ??= {};
        tool.inputSchema.required ??= [];

        if (!tool.inputSchema.properties[INTERNAL_INTENT_KEY]) {
            tool.inputSchema.properties[INTERNAL_INTENT_KEY] = {
                type: "string",
                description: `In ≤ ${INTENT_WORD_LIMIT} words, describe why you are calling this tool and how its result advances your overall task. Don't use first-person pronouns like "I" or "my". Make sure to give a gist of the whole task and how this tool fits into it.`,
            };
            if (!tool.inputSchema.required.includes(INTERNAL_INTENT_KEY)) {
                tool.inputSchema.required.push(INTERNAL_INTENT_KEY);
            }
        }

        return tool;
    });
}
