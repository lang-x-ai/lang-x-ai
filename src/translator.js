import { generateAIResponse } from "./aiModel.js";

async function translate(parsedData) {
  const { lang, prompt, functions, variables, blocks } = parsedData;

  // There are a bunch of empty {} or [] being created in the parsedData.
  // I need to fix the promts.

  // Validate input
  if (!lang) {
    throw new Error("Target language or prompt is missing");
  }
  const aiPrompt = `
  You are a highly skilled and precise coding assistant. Your task is to generate code snippets in the target language specified. The goal is to accurately translate or adapt provided "blocks" of code to the "lang" target while integrating necessary logic from "variables" or "functions." 
  
  ### Input Details:
  - Target language: ${lang}
  - Prompt/Description: ${prompt}
  - Available functions: ${functions}
  - Variables/context to use: ${variables}
  - Code blocks for translation: 
  ${blocks}
  
  ### Expected Output:
  - Fully translated and functional code in ${lang}.
  - Ensure proper syntax, formatting, and coding conventions for ${lang}.
  - Include comments explaining any significant transformations or assumptions.
  
  Provide only the translated code, without additional explanations.
  `;

  console.log(aiPrompt);

  // Generate and return the code
  return await generateAIResponse(aiPrompt.trim());
}

export { translate };
