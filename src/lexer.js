function tokenize(code) {
  const tokens = [];

  const tokenSpec = [
    // Keywords
    [
      "KEYWORD",
      /^(let|const|var|function|if|else|for|while|return|class|extends|implements|import|export|default|from)\b/,
    ],

    // Prompt declaration
    ["PROMPT", /^prompt\s*:/],

    // Language declaration
    ["LANG", /^lang\s*:\s*(js|ts|java|py|cpp|c|sol)/],

    // Identifiers (variable/function names, excluding keywords)
    [
      "IDENTIFIER",
      /^(?!let\b|const\b|var\b|function\b|if\b|else\b|for\b|while\b|return\b|class\b|extends\b|implements\b|import\b|export\b|default\b|from\b|prompt\b)[a-zA-Z_$][a-zA-Z0-9_$]*/,
    ],

    // Numbers
    ["NUMBER", /^\d+(\.\d+)?/],

    // Strings
    ["STRING", /^"([^"\\]|\\.)*"|^'([^'\\]|\\.)*'/],

    // Operators
    [
      "OPERATOR",
      /^(\+|\-|\*|\/|=|===|==|!==|!=|<|>|<=|>=|\+\+|\-\-|\+=|-=|\*=|\/=|\|\||&&|!)/,
    ],

    // Punctuation
    ["PUNCTUATION", /^(\{|\}|\(|\)|\[|\]|;|,|\.)/],

    // Colon for other uses
    ["COLON", /^:/],

    // Whitespace (ignored)
    ["WHITESPACE", /^\s+/],
  ];

  // Split code into lines for better error handling
  const lines = code.split("\n");

  lines.forEach((line, lineNumber) => {
    let currentLine = line;
    while (currentLine.length > 0) {
      currentLine = currentLine.trimStart();
      let matched = false;

      for (const [type, pattern] of tokenSpec) {
        const match = currentLine.match(pattern);
        if (match) {
          // Ignore whitespace tokens
          if (type !== "WHITESPACE") {
            tokens.push({
              type,
              value: match[0],
              line: lineNumber + 1,
              column: line.length - currentLine.length + 1,
            });
          }

          // Remove the matched token from the line
          currentLine = currentLine.slice(match[0].length);
          matched = true;
          break;
        }
      }

      // If no token matches, throw an error
      if (!matched) {
        throw new Error(
          `Unrecognized token at line ${lineNumber + 1}: ${currentLine.trim()}`
        );
      }
    }
  });

  return tokens;
}

export { tokenize };
