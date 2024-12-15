// Import the dotenv package to load environment variables from a .env file
import dotenv from "dotenv";

// Load environment variables into process.env
dotenv.config();

/**
 * Generates a response from the AI model using the provided prompt.
 *
 * @param {string} prompt - The input prompt to send to the AI model.
 * @returns {Promise<string>} - The AI-generated response, cleaned of code block delimiters.
 * @throws Will throw an error if the API key is missing or if the API request fails.
 */
async function generateAIResponse(prompt) {
  // Retrieve the OpenAI API key from environment variables
  const apiKey = process.env.OPENAI_API_KEY;

  // Check if the API key is available
  if (!apiKey) {
    throw new Error(
      "API key is missing. Please set the OPENAI_API_KEY environment variable."
    );
  }

  // Make a POST request to the OpenAI API to get a chat completion
  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o", // Specify the model to use
      messages: [{ role: "user", content: prompt }], // Send the user prompt
    }),
  });

  // Parse the JSON response from the API
  const data = await response.json();

  // Check if the response was successful
  if (!response.ok) {
    console.error(
      "Error from OpenAI API:",
      data.error?.message || "Unknown error"
    );
    throw new Error(data.error?.message || "Unknown error");
  }

  /**
   * Removes code block delimiters from the generated code.
   *
   * @param {string} generatedCode - The code content to clean.
   * @returns {string} - The cleaned code without delimiters.
   */
  function removeCodeBlockDelimiters(generatedCode) {
    return generatedCode.replace(/```[a-z]*\n/g, "").replace(/```/g, "");
  }

  // Use the function to clean up the generated code
  const cleanedContent = removeCodeBlockDelimiters(
    data.choices[0].message.content
  );

  // Return the cleaned AI-generated content
  return cleanedContent;
}

// Export the generateAIResponse function for use in other modules
export { generateAIResponse };
