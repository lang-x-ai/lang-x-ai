
function tokenize(code) {
    var tokens = [];
    var tokenSpec = [
        //need better lexer, its too vague and abstract. 
        ["TARGET", /TARGET_LANGUAGE: (.+)/i],
        ["PROMPT", /PROMPT: (.+)/i],
        ["DEFINE_FUNC", /DEFINE FUNCTION (\w+)/i],
        ["INPUT", /INPUT (\w+)/i],
        ["PRINT", /PRINT (.+)/i],
        ["CALL", /CALL (\w+) WITH (.+)/i],
        ["END_FUNC", /END FUNCTION/i]
    ];

    code.split("\n").forEach(function (line) {
        line = line.trim();
        if (!line) return;

        for (var i = 0; i < tokenSpec.length; i++) {
            var type = tokenSpec[i][0];
            var pattern = tokenSpec[i][1];
            var match = line.match(pattern);
            if (match) {
                tokens.push({ type: type, value: match[1] || "" });
                break;
            }
        }
    });

    return tokens;
}

// Use ES module export syntax
export { tokenize };
