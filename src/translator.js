import { generateAIResponse } from "./aiModel.js";

export async function translate(parsedData) {
  // There are a bunch of empty {} or [] being created in the parsedData.
  // I need to fix the promts.

  // // Validate input
  // if (!lang) {
  //   throw new Error("Target language or prompt is missing");
  // }

  const aiPrompt = `
 You are a highly skilled and precise coding assistant. Your task is to generate code snippets based on the abstract syntax tree (AST) rules provided. 
Here are the rules for the AST:

1. **Node Types**: Understand and identify different node types.

2. **Traversal**: Traverse the AST in a depth-first manner to ensure all nodes are visited and processed.

3. **Transformation**: Apply transformations based on node types. 
4. **Contextual Integration**: Ensure that the translated code integrates seamlessly with existing code. This includes:
   - Maintaining variable scope and function context.
   - Preserving logic and flow of the original code.

5. **Error Handling**: Implement error handling for unsupported node types or syntax errors.

6. **Output**: Provide only the translated code, without additional explanations.

7. write in c

Use the entire codebase as context to ensure consistency and accuracy in translation. The target language is specified in the input, and the output should adhere to its syntax and conventions.

Begin the translation process by analyzing the provided code block and applying the AST rules accordingly.

Here is the data = ${parsedData}
  `;

  console.log(aiPrompt);

  // Generate and return the code
  return await generateAIResponse(aiPrompt.trim());
}

