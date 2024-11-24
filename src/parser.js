function parse(tokens) {
    const parsed = {
        target_language: null,
        prompt: null,
        functions: {}
    };

    let currentFunction = null;

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
            case "END_FUNC":
                currentFunction = null;
                break;
        }
    });

    return parsed;
}

export { parse };
