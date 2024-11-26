import fs from "fs";
// Removed unnecessary import of console
import path from "path";
import { tokenize } from "./lexer.js";
import { parse } from "./parser.js";
import { translate } from "./translator.js";

export async function cli() {
  const [, , source, outputArg] = process.argv;

  console.log("Starting CLI...");

  // Ensure source file is provided
  if (!source) {
    console.error("Usage: node src/cli.js <source.x> [output]");
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
    const code = fs.readFileSync(sourcePath, "utf-8");

    // Tokenize the code
    const tokens = tokenize(code);

    // Parse tokens into data
    const parsedData = parse(tokens);

    // Translate parsed data into target code
    const generatedCode = await translate(parsedData);

    const targetLanguage = parsedData.lang;

    let fileExtension;
    switch (targetLanguage) {
      case "js":
        fileExtension = ".js";
        break;
      case "ts":
        fileExtension = ".ts";
        break;
      case "py":
        fileExtension = ".py";
        break;
      case "java":
        fileExtension = ".java";
        break;
      case "c":
        fileExtension = ".c";
        break;
      case "cpp":
        fileExtension = ".cpp";
        break;
      case "sol":
        fileExtension = ".sol";
        break;
      default:
        fileExtension = ".x";
    }

    const output = outputArg?.endsWith(fileExtension)
      ? outputArg
      : `${outputArg || "output"}${fileExtension}`;
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
}

cli();
