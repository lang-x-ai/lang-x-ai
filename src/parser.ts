import { Token } from "./lexer";

export interface ParsedData {
    target_language: string | null;
    prompt: string | null;
    functions: {
        [funcName: string]: {
            input: string[];
            body: [string, string][];
        };
    };
}

export function parse(tokens: Token[]): ParsedData {
    const parsed: ParsedData = {
        target_language: null,
        prompt: null,
        functions: {}
    };

    let currentFunction: string | null = null;

    tokens.forEach(token => {
        switch (token.type) {
            case "TARGET":
                parsed.target_language = token.value.trim();
                break;
            case "PROMPT":
                parsed.prompt = token.value.trim();
                break;
            case "DEFINE_FUNC":
                currentFunction = token.value.trim();
                parsed.functions[currentFunction] = { input: [], body: [] };
                break;
            case "INPUT":
                if (currentFunction) parsed.functions[currentFunction].input.push(token.value.trim());
                break;
            case "PRINT":
            case "ARITHMETIC":
                if (currentFunction) parsed.functions[currentFunction].body.push([token.type, token.value.trim()]);
                break;
            case "END_FUNC":
                currentFunction = null;
                break;
        }
    });

    return parsed;
}
