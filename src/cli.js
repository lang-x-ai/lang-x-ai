import fs from "fs";
import path from "path";
import { InputStream } from "./inputStream.js";
import { TokenStream } from "./lexer.js";
import { parse } from "./parser.js";
import { translate } from "./translator.js";

// Removed readStdin function

const [, , source, targetLanguage] = process.argv;

console.log("Starting CLI...");

// Ensure source file is provided
if (!source) {
  console.error("Usage: node src/cli.js <source.x> <targetLanguage>");
  process.exit(1);
}

// Ensure the source file has a .x extension
if (!source.endsWith(".x")) {
  console.error("Error: Source file must have a .x extension");
  process.exit(1);
}

// Resolve the absolute path of the source file
const sourcePath = path.resolve(source);

// Check if the source file exists
if (!fs.existsSync(sourcePath)) {
  console.error(`Error: Source file not found at "${sourcePath}"`);
  process.exit(1);
}

try {
  // Read source file
  const fileCode = fs.readFileSync(sourcePath, "utf-8");

  const inputCode = InputStream(fileCode);

  // Tokenize the code
  const tokens = TokenStream(inputCode);
  console.log(fileCode);

  // Parse tokens into data
  const parsedData = parse(tokens);
  console.log(parsedData);

  // Translate parsed data into target code
  const generatedCode = await translate(JSON.stringify(parsedData, null, 2));
  console.log(generatedCode);

  const fileExtensions = {
    js: ".js",
    ts: ".ts",
    py: ".py",
    java: ".java",
    c: ".c",
    cpp: ".cpp",
    sol: ".sol",
  };

  const fileExtension = fileExtensions[targetLanguage] || ".py";

  const output = `output${fileExtension}`;
  const outputPath = path.resolve(output);
  console.log(`Output path resolved: ${outputPath}`);

  // Write generated code to the output file
  fs.writeFileSync(outputPath, generatedCode);
  console.log("Generated code written to file successfully.");
} catch (error) {
  console.error("Error during processing:", error.message);
  console.error("Stack Trace:", error.stack);
  process.exit(1);
}
