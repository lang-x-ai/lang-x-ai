export type Token = { type: string; value: string };

export function tokenize(code: string): Token[] {
    const tokens: Token[] = [];
    const tokenSpec: [string, RegExp][] = [
        ["TARGET", /TARGET_LANGUAGE: (.+)/i],
        ["PROMPT", /PROMPT: (.+)/i],
        ["DEFINE_FUNC", /DEFINE FUNCTION (\w+)/i],
        ["INPUT", /INPUT (\w+)/i],
        ["PRINT", /PRINT (.+)/i],
        ["CALL", /CALL (\w+) WITH (.+)/i],
        ["ARITHMETIC", /(.+)/i],
        ["END_FUNC", /END FUNCTION/i]
    ];

    code.split("\n").forEach(line => {
        line = line.trim();
        if (!line) return;

        for (const [type, pattern] of tokenSpec) {
            const match = line.match(pattern);
            if (match) {
                tokens.push({ type, value: match[1] || "" });
                break;
            }
        }
    });

    return tokens;
}
