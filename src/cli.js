// Import necessary modules
import fs from "fs"; // File system module for reading and writing files
import path from "path"; // Path module for handling file paths
import { fileURLToPath } from "url"; // Convert URL to file path
import { InputStream } from "./inputStream.js"; // Custom module for input stream
import { TokenStream } from "./lexer.js"; // Custom module for token stream
import { parse } from "./parser.js"; // Custom module for parsing
import { translate } from "./translator.js"; // Custom module for translation

// Command line arguments: source file and target language
const [, , source] = process.argv; // Extract the source file argument from command line

console.log("Starting CLI...");

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url); // Get the current file name
const __dirname = path.dirname(__filename); // Get the directory name of the current file

// Determine the absolute path of the source file in the /imports directory at the root level
const sourcePath = path.resolve(__dirname, "../imports", source); // Resolve the source file path

// Validate the presence of the source file argument
if (!source) {
  console.error("Usage: node src/cli.js <source.x> <targetLanguage>"); // Error message for missing source file
  process.exit(1); // Exit the process with an error code
}

// Validate the source file extension
if (!source.endsWith(".x")) {
  console.error("Error: Source file must have a .x extension"); // Error message for incorrect file extension
  process.exit(1); // Exit the process with an error code
}

// Check the existence of the source file
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source file not found at "${sourcePath}"`); // Error message for missing file
  process.exit(1); // Exit the process with an error code
}

try {
  // Read the contents of the source file
  const fileCode = fs.readFileSync(sourcePath, "utf-8"); // Read the file content as a string

  // Create an input stream from the file contents
  const inputCode = InputStream(fileCode); // Initialize input stream with file content

  // Create a token stream from the input stream
  const tokens = TokenStream(inputCode); // Tokenize the input stream

  // Parse the token stream into an abstract syntax tree (AST)
  const parsedData = parse(tokens); // Parse tokens into AST

  // Translate the AST into code for the target language
  const generatedCode = await translate(JSON.stringify(parsedData, null, 2)); // Translate AST to target language code

  const fileExtension = parsedData.lang; // Get the target language file extension

  // Construct the output file name
  const output = `output${fileExtension}`; // Create output file name with extension
  // Resolve the output file path in the /exports directory at the root level
  const outputPath = path.resolve(__dirname, "../exports", output); // Resolve output file path

  // Write the translated code to the output file
  fs.writeFileSync(outputPath, generatedCode); // Write the generated code to the output file
  console.log("Generated code written to file successfully."); // Success message
} catch (error) {
  // Handle any errors that occur during file reading or writing
  console.error("Error during processing:", error.message); // Log error message
  console.error("Stack Trace:", error.stack); // Log stack trace for debugging
  process.exit(1); // Exit the process with an error code
}
