import { generateAIResponse } from "./aiModel.js";

async function translate(parsedData) {
  const { lang, prompt, functions, variables, blocks } = parsedData;

  // Validate input
  if (!lang) {
    throw new Error("Target language or prompt is missing");
  }

  // Prepare detailed descriptions for variables
  let variableDescriptions = Object.entries(variables)
    .map(([name, details]) => {
      return `Variable: ${name}
- Description: ${details.prompt || "No specific description"}
- Value: ${details.value}`;
    })
    .join("\n\n");

  // Prepare detailed descriptions for functions
  let functionDescriptions = Object.entries(functions)
    .map(([name, details]) => {
      // Convert function body tokens to readable string
      const functionBody = details.body
        ? details.body.map((token) => `${token.type}: ${token.value}`).join(" ")
        : "No body defined";

      return `Function: ${name}
- Description: ${details.prompt || "No specific description"}
- Body Preview: ${functionBody}`;
    })
    .join("\n\n");

  // Prepare block context
  let blockDescriptions = blocks
    .map((block, index) => {
      const blockVariables = Object.keys(block.variables).join(", ") || "None";
      const blockFunctions = Object.keys(block.functions).join(", ") || "None";

      return `Block ${index + 1}:
- Variables: ${blockVariables}
- Functions: ${blockFunctions}`;
    })
    .join("\n\n");

  // Create comprehensive AI prompt
  const aiPrompt = `
Code Generation Request for ${lang.toUpperCase()} Language

Project Overview:
${prompt}

Detailed Context:

1. Global Variables:
${variableDescriptions || "No global variables defined"}

2. Global Functions:
${functionDescriptions || "No global functions defined"}

3. Block Structure:
${blockDescriptions || "No complex block structure"}

Generation Requirements:
- Produce fully functional ${lang} code
- Implement all described variables and functions
- Maintain the intended logic and structure
- Add appropriate comments explaining the code
- Follow ${lang} language best practices
- Ensure readability and maintainability
- Just code, no explanation, the reponse should be just in ${lang} 

Output Format:
- Provide complete, executable code
- Include necessary imports or dependencies
- Use proper ${lang} syntax and conventions

Important Notes:
- Preserve the original intent described in the project overview
- If any implementation details are ambiguous, make reasonable assumptions
- Focus on clean, efficient code implementation

Please generate the code strictly based on the provided specifications.
`;

  // Generate and return the code
  return await generateAIResponse(aiPrompt.trim());
}

export { translate };
