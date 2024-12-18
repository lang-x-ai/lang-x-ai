import fs from "fs";
import path from "path";
import { fileURLToPath } from "url"; // Import fileURLToPath from 'url'
import { InputStream } from "./inputStream.js";
import { TokenStream } from "./lexer.js";
import { parse } from "./parser.js";
import { translate } from "./translator.js";

// Command line arguments: source file and target language
const [, , source, targetLanguage] = process.argv;

console.log("Starting CLI...");

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Determine the absolute path of the source file in the /imports directory at the root level
const sourcePath = path.resolve(__dirname, "../imports", source);

// Validate the presence of the source file argument
if (!source) {
  console.error("Usage: node src/cli.js <source.x> <targetLanguage>");
  process.exit(1);
}

// Validate the source file extension
if (!source.endsWith(".x")) {
  console.error("Error: Source file must have a .x extension");
  process.exit(1);
}

// Check the existence of the source file
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source file not found at "${sourcePath}"`);
  process.exit(1);
}

try {
  // Read the contents of the source file
  const fileCode = fs.readFileSync(sourcePath, "utf-8");

  // Create an input stream from the file contents
  const inputCode = InputStream(fileCode);

  // Create a token stream from the input stream
  const tokens = TokenStream(inputCode);

  // Parse the token stream into an abstract syntax tree (AST)
  const parsedData = parse(tokens);

  // Translate the AST into code for the target language
  const generatedCode = await translate(JSON.stringify(parsedData, null, 2));

  const fileExtension = parsedData.lang;

  // Construct the output file name
  const output = `output${fileExtension}`;
  // Resolve the output file path in the /exports directory at the root level
  const outputPath = path.resolve(__dirname, "../exports", output);

  // Write the translated code to the output file
  fs.writeFileSync(outputPath, generatedCode);
  console.log("Generated code written to file successfully.");
} catch (error) {
  // Handle any errors that occur during file reading or writing
  console.error("Error during processing:", error.message);
  console.error("Stack Trace:", error.stack);
  process.exit(1);
}
