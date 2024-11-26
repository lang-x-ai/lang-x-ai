function parse(tokens) {
  const parsed = initializeParsedStructure();
  let currentPrompt = null;
  let currentBlock = initializeBlock();
  let currentFunction = null;
  const tokenStack = [];

  tokens.forEach((token, index) => {
    switch (token.type) {
      case "LANG":
        processLangDeclaration(token, parsed);
        break;
      case "PROMPT":
        currentPrompt = processPrompt(tokens, index);
        break;
      case "KEYWORD":
        if (["const", "let", "var"].includes(token.value)) {
          const variableDetails = processVariableDeclaration(
            tokens,
            index,
            currentPrompt
          );
          if (variableDetails) {
            parsed.variables[variableDetails.name] = variableDetails;
            currentBlock.variables[variableDetails.name] = variableDetails;
            currentPrompt = null;
          }
        } else if (token.value === "function") {
          const functionDetails = processFunctionDeclaration(
            tokens,
            index,
            currentPrompt
          );
          if (functionDetails) {
            parsed.functions[functionDetails.name] = functionDetails;
            currentBlock.functions[functionDetails.name] = functionDetails;
            currentFunction = functionDetails.name;
            currentPrompt = null;
          }
        }
        break;
      case "IDENTIFIER":
        if (["const", "let", "var"].includes(token.value)) {
          processVariableDeclaration(
            tokens,
            index,
            currentBlock,
            currentPrompt
          );
          currentPrompt = null; // Reset prompt after use
        } else if (token.value === "function") {
          currentFunction = processFunctionDeclaration(
            tokens,
            index,
            currentBlock,
            currentPrompt
          );
          currentPrompt = null; // Reset prompt after use
        }
        break;

      case "PUNCTUATION":
        currentBlock = processPunctuation(
          token,
          currentBlock,
          currentFunction,
          tokenStack,
          parsed
        );
        if (token.value === "}") currentFunction = null; // Reset function context
        break;
      default:
        break;
    }
  });

  finalizeParsing(parsed, tokenStack);
  return parsed;
}

export { parse };

// Utility Functions

function initializeParsedStructure() {
  return {
    lang: null,
    variables: {},
    functions: {},
    blocks: [],
  };
}

function initializeBlock(parent) {
  return {
    parent,
    variables: {},
    functions: {},
    statements: [],
  };
}
function processLangDeclaration(token, parsed) {
  if (!token || !token.value) {
    throw new Error("Language declaration token is missing or invalid.");
  }
  if (parsed.lang) {
    throw new Error("Multiple language declarations are not allowed.");
  }

  // Extract language directly from the token
  const match = token.value.match(/lang\s*:\s*(js|ts|java|py|cpp|c|sol)/);
  if (match) {
    parsed.lang = match[1];
  } else {
    throw new Error("Invalid language declaration.");
  }
}

function processPrompt(tokens, index) {
  if (tokens[index + 1] && tokens[index + 1].type === "STRING") {
    return tokens[index + 1].value.slice(1, -1); // Remove quotes
  } else {
    throw new Error("Invalid prompt syntax.");
  }
}

function processVariableDeclaration(tokens, index, currentPrompt) {
  if (
    tokens[index + 1] &&
    tokens[index + 1].type === "IDENTIFIER" &&
    tokens[index + 2] &&
    tokens[index + 2].type === "OPERATOR" &&
    tokens[index + 3] &&
    (tokens[index + 3].type === "NUMBER" ||
      tokens[index + 3].type === "STRING") &&
    tokens[index + 4] &&
    tokens[index + 4].type === "PUNCTUATION" &&
    tokens[index + 4].value === ";"
  ) {
    const varName = tokens[index + 1].value;
    const varValue = tokens[index + 3].value;

    return {
      name: varName,
      prompt: currentPrompt || null,
      value: varValue,
    };
  }

  return null;
}

function processFunctionDeclaration(tokens, index, currentPrompt) {
  if (
    tokens[index + 1] &&
    tokens[index + 1].type === "IDENTIFIER" &&
    tokens[index + 2] &&
    tokens[index + 2].type === "PUNCTUATION" &&
    tokens[index + 2].value === "(" &&
    tokens[index + 3] &&
    tokens[index + 3].type === "PUNCTUATION" &&
    tokens[index + 3].value === ")" &&
    tokens[index + 4] &&
    tokens[index + 4].type === "PUNCTUATION" &&
    tokens[index + 4].value === "{"
  ) {
    const funcName = tokens[index + 1].value;
    return {
      name: funcName,
      prompt: currentPrompt || null,
      body: [],
    };
  }

  return null;
}

function processPunctuation(
  token,
  currentBlock,
  currentFunction,
  tokenStack,
  parsed
) {
  if (token.value === "{") {
    const newBlock = initializeBlock(currentBlock);
    tokenStack.push(currentBlock);
    currentBlock = newBlock;

    // Add newBlock to parsed.blocks
    parsed.blocks.push(currentBlock);
  } else if (token.value === "}") {
    if (!currentBlock.parent) {
      throw new Error("Unmatched closing brace.");
    }
    currentBlock = tokenStack.pop();
  }
  return currentBlock;
}

function processStatement(token, currentFunction, currentBlock) {
  if (currentFunction && currentBlock.functions[currentFunction]) {
    currentBlock.functions[currentFunction].body.push(token);
  } else {
    currentBlock.statements.push(token);
  }
}

function finalizeParsing(parsed, tokenStack) {
  if (!parsed.lang) {
    throw new Error("Missing language declaration.");
  }

  if (tokenStack.length > 0) {
    throw new Error("Unclosed block detected.");
  }
}
